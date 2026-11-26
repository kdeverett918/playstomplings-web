/**
 * Tiny deterministic QR Code encoder (byte mode, ECC level M, versions 1–10).
 * Algorithm follows ISO/IEC 18004 (structure modeled on Project Nayuki's reference).
 * Pure TS — no network or image API calls.
 */

const ECC_CW_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26]
const BLOCKS_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5]

const getBit = (x: number, i: number) => ((x >>> i) & 1) !== 0

function rawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2
    result -= (25 * numAlign - 10) * numAlign - 55
    if (ver >= 7) result -= 36
  }
  return result
}

const dataCodewords = (ver: number) => Math.floor(rawDataModules(ver) / 8) - ECC_CW_M[ver] * BLOCKS_M[ver]

function gfMul(x: number, y: number): number {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d)
    z ^= ((y >>> i) & 1) * x
  }
  return z & 0xff
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j], root)
      if (j + 1 < result.length) result[j] ^= result[j + 1]
    }
    root = gfMul(root, 0x02)
  }
  return result
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0)
  for (const b of data) {
    const factor = b ^ (result.shift() as number)
    result.push(0)
    divisor.forEach((coef, i) => {
      result[i] ^= gfMul(coef, factor)
    })
  }
  return result
}

function alignmentPositions(ver: number): number[] {
  if (ver === 1) return []
  const numAlign = Math.floor(ver / 7) + 2
  const size = ver * 4 + 17
  const step = Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2
  const result = [6]
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos)
  return result
}

const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
]

export function encodeQR(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text))

  let ver = 1
  for (; ver <= 10; ver++) {
    const ccBits = ver <= 9 ? 8 : 16
    if (4 + ccBits + bytes.length * 8 <= dataCodewords(ver) * 8) break
  }
  if (ver > 10) throw new Error('QR payload too long')

  // --- Data bit stream ---
  const bits: number[] = []
  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1)
  }
  push(0b0100, 4)
  push(bytes.length, ver <= 9 ? 8 : 16)
  bytes.forEach((b) => push(b, 8))
  const capacity = dataCodewords(ver) * 8
  push(0, Math.min(4, capacity - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    let v = 0
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j]
    data.push(v)
  }

  // --- ECC + interleave ---
  const numBlocks = BLOCKS_M[ver]
  const eccLen = ECC_CW_M[ver]
  const rawCodewords = Math.floor(rawDataModules(ver) / 8)
  const numShort = numBlocks - (rawCodewords % numBlocks)
  const shortLen = Math.floor(rawCodewords / numBlocks)
  const div = rsDivisor(eccLen)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1))
    k += dat.length
    const ecc = rsRemainder(dat, div)
    if (i < numShort) dat.push(0)
    blocks.push(dat.concat(ecc))
  }
  const codewords: number[] = []
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= numShort) codewords.push(block[i])
    })
  }

  // --- Function patterns ---
  const size = ver * 4 + 17
  const modules: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const isFn: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const setFn = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark
    isFn[y][x] = true
  }

  for (let i = 0; i < size; i++) {
    setFn(6, i, i % 2 === 0)
    setFn(i, 6, i % 2 === 0)
  }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy))
        const x = cx + dx
        const y = cy + dy
        if (x >= 0 && x < size && y >= 0 && y < size) setFn(x, y, dist !== 2 && dist !== 4)
      }
  }
  finder(3, 3)
  finder(size - 4, 3)
  finder(3, size - 4)

  const align = alignmentPositions(ver)
  const na = align.length
  for (let i = 0; i < na; i++)
    for (let j = 0; j < na; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++) setFn(align[i] + dx, align[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }

  const drawFormat = (mask: number) => {
    const d = (0 << 3) | mask // ECC level M = 0b00
    let rem = d
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
    const fb = ((d << 10) | rem) ^ 0x5412
    for (let i = 0; i <= 5; i++) setFn(8, i, getBit(fb, i))
    setFn(8, 7, getBit(fb, 6))
    setFn(8, 8, getBit(fb, 7))
    setFn(7, 8, getBit(fb, 8))
    for (let i = 9; i < 15; i++) setFn(14 - i, 8, getBit(fb, i))
    for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, getBit(fb, i))
    for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, getBit(fb, i))
    setFn(8, size - 8, true)
  }
  drawFormat(0)

  if (ver >= 7) {
    let rem = ver
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
    const vb = (ver << 12) | rem
    for (let i = 0; i < 18; i++) {
      const bit = getBit(vb, i)
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      setFn(a, b, bit)
      setFn(b, a, bit)
    }
  }

  // --- Codewords zig-zag ---
  let bi = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const upward = ((right + 1) & 2) === 0
        const y = upward ? size - 1 - vert : vert
        if (!isFn[y][x] && bi < codewords.length * 8) {
          modules[y][x] = getBit(codewords[bi >>> 3], 7 - (bi & 7))
          bi++
        }
      }
  }

  // --- Mask selection (simplified penalty: runs, 2×2 blocks, balance) ---
  const applyMask = (m: number) => {
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) if (!isFn[y][x] && MASKS[m](x, y)) modules[y][x] = !modules[y][x]
  }
  const penalty = () => {
    let p = 0
    let dark = 0
    for (let y = 0; y < size; y++) {
      let runR = 1
      let runC = 1
      for (let x = 0; x < size; x++) {
        if (modules[y][x]) dark++
        if (x > 0) {
          if (modules[y][x] === modules[y][x - 1]) runR++
          else {
            if (runR >= 5) p += runR - 2
            runR = 1
          }
          if (modules[x][y] === modules[x - 1][y]) runC++
          else {
            if (runC >= 5) p += runC - 2
            runC = 1
          }
        }
        if (x > 0 && y > 0) {
          const c = modules[y][x]
          if (c === modules[y - 1][x] && c === modules[y][x - 1] && c === modules[y - 1][x - 1]) p += 3
        }
      }
      if (runR >= 5) p += runR - 2
      if (runC >= 5) p += runC - 2
    }
    const total = size * size
    p += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10
    return p
  }
  let best = 0
  let bestP = Infinity
  for (let m = 0; m < 8; m++) {
    applyMask(m)
    drawFormat(m)
    const p = penalty()
    if (p < bestP) {
      bestP = p
      best = m
    }
    applyMask(m)
  }
  applyMask(best)
  drawFormat(best)
  return modules
}

/** Returns an SVG path string (1 unit per module) with a quiet zone offset. */
export function qrPath(text: string, quiet = 4): { d: string; size: number } {
  const m = encodeQR(text)
  const n = m.length
  let d = ''
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x + quiet} ${y + quiet}h1v1h-1z`
  return { d, size: n + quiet * 2 }
}
