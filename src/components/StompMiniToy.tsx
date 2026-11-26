'use client'

import { RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

/* ---------------- Puzzle data ---------------- */

const N = 6
type Cell = number | null // color index or empty
type Shape = ReadonlyArray<readonly [number, number]> // [row, col] offsets
interface Piece {
  id: string
  name: string
  shape: Shape
  color: number
}
interface Puzzle {
  title: string
  hint: string
  grid: string[]
  pieces: Piece[]
}

const COLORS = [
  { face: 'oklch(0.7 0.17 150)', lip: 'oklch(0.5 0.14 150)' }, // emerald
  { face: 'oklch(0.7 0.19 28)', lip: 'oklch(0.52 0.17 28)' }, // coral
  { face: 'oklch(0.72 0.13 235)', lip: 'oklch(0.52 0.13 245)' }, // sky
  { face: 'oklch(0.84 0.15 85)', lip: 'oklch(0.66 0.14 70)' }, // gold
  { face: 'oklch(0.66 0.13 190)', lip: 'oklch(0.48 0.1 195)' }, // teal
]
const LETTER: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, e: 4 }

const TARGETS: ReadonlyArray<readonly [number, number]> = [
  [2, 2],
  [2, 3],
  [3, 2],
  [3, 3],
]
const isTarget = (r: number, c: number) => TARGETS.some(([tr, tc]) => tr === r && tc === c)

const I3H: Shape = [[0, 0], [0, 1], [0, 2]]
const I3V: Shape = [[0, 0], [1, 0], [2, 0]]
const I2V: Shape = [[0, 0], [1, 0]]
const O2: Shape = [[0, 0], [0, 1], [1, 0], [1, 1]]
const L_A: Shape = [[0, 1], [1, 0], [1, 1]]
const L_B: Shape = [[0, 0], [0, 1], [1, 0]]

const PUZZLES: Puzzle[] = [
  {
    title: 'Row Rumble',
    hint: 'Fill the two middle rows to clear the golden zone.',
    grid: ['a..b..', '.c..d.', 'a...bb', 'cd...a', '..e..c', 'b...e.'],
    pieces: [
      { id: 'p1', name: 'Straight three', shape: I3H, color: 0 },
      { id: 'p2', name: 'Straight three', shape: I3H, color: 2 },
      { id: 'p3', name: 'Tall domino', shape: I2V, color: 1 },
    ],
  },
  {
    title: 'Column Crunch',
    hint: 'Think vertically — two columns run through the gold.',
    grid: ['..ab..', 'c.ba.d', 'e.....', '.d...a', '..c..b', 'a.dc..'],
    pieces: [
      { id: 'p1', name: 'Square', shape: O2, color: 3 },
      { id: 'p2', name: 'Tall domino', shape: I2V, color: 0 },
      { id: 'p3', name: 'Tall three', shape: I3V, color: 2 },
    ],
  },
  {
    title: 'Corner Crush',
    hint: 'Two little corners slot right into the gold.',
    grid: ['a....b', 'b.c...', 'ab..ca', 'cd..ab', 'e.....', '..d.e.'],
    pieces: [
      { id: 'p1', name: 'Corner', shape: L_B, color: 1 },
      { id: 'p2', name: 'Straight three', shape: I3H, color: 4 },
      { id: 'p3', name: 'Corner', shape: L_A, color: 0 },
    ],
  },
]

const parseGrid = (g: string[]): Cell[][] =>
  g.map((row) => row.split('').map((ch) => (ch in LETTER ? LETTER[ch] : null)))

/* ---------------- Web Audio boops ---------------- */

function useSynth(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)
  return useCallback(
    (kind: 'place' | 'clear' | 'stomp' | 'win' | 'nope') => {
      if (muted || typeof window === 'undefined') return
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      if (!ctxRef.current) ctxRef.current = new AC()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') void ctx.resume()
      const now = ctx.currentTime
      const tone = (freq: number, start: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = type
        o.frequency.setValueAtTime(freq, now + start)
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now + start + dur)
        g.gain.setValueAtTime(0.0001, now + start)
        g.gain.exponentialRampToValueAtTime(vol, now + start + 0.015)
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
        o.connect(g).connect(ctx.destination)
        o.start(now + start)
        o.stop(now + start + dur + 0.05)
      }
      if (kind === 'place') tone(520, 0, 0.12, 'triangle', 0.12, 700)
      if (kind === 'nope') tone(220, 0, 0.14, 'square', 0.04, 160)
      if (kind === 'clear') [660, 880, 1100].forEach((f, i) => tone(f, i * 0.06, 0.16, 'sine', 0.1))
      if (kind === 'stomp') tone(140, 0, 0.35, 'sine', 0.35, 45)
      if (kind === 'win') [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.28, 'triangle', 0.1))
    },
    [muted],
  )
}

/* ---------------- Visual bits ---------------- */

function Block({ color, className = '', style }: { color: number; className?: string; style?: CSSProperties }) {
  const c = COLORS[color]
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-[3px] rounded-[22%] ${className}`}
      style={{
        background: `linear-gradient(180deg, color-mix(in oklch, ${c.face} 70%, oklch(0.98 0.02 90)) 0%, ${c.face} 45%, ${c.face} 100%)`,
        boxShadow: `inset 0 -4px 0 ${c.lip}, inset 0 2px 0 oklch(0.98 0.02 90 / 0.55), 0 2px 4px oklch(0.2 0.05 262 / 0.25)`,
        ...style,
      }}
    />
  )
}

function StomplingSprite() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_10px_8px_oklch(0.15_0.05_300/0.45)]" aria-hidden="true">
      <rect x="22" y="100" width="26" height="14" rx="5" fill="oklch(0.38 0.16 300)" />
      <rect x="72" y="100" width="26" height="14" rx="5" fill="oklch(0.38 0.16 300)" />
      <rect x="10" y="14" width="100" height="92" rx="22" fill="oklch(0.55 0.2 300)" />
      <rect x="10" y="14" width="100" height="92" rx="22" fill="url(#stomp-gloss)" />
      <rect x="10" y="88" width="100" height="18" rx="9" fill="oklch(0.44 0.18 300)" />
      <rect x="30" y="42" width="18" height="24" rx="8" fill="oklch(0.99 0.008 90)" />
      <rect x="72" y="42" width="18" height="24" rx="8" fill="oklch(0.99 0.008 90)" />
      <rect x="35" y="50" width="10" height="13" rx="5" fill="oklch(0.2 0.04 262)" />
      <rect x="77" y="50" width="10" height="13" rx="5" fill="oklch(0.2 0.04 262)" />
      <circle cx="39" cy="53" r="2.4" fill="oklch(0.99 0.008 90)" />
      <circle cx="81" cy="53" r="2.4" fill="oklch(0.99 0.008 90)" />
      <ellipse cx="24" cy="74" rx="8" ry="5" fill="oklch(0.72 0.17 10 / 0.7)" />
      <ellipse cx="96" cy="74" rx="8" ry="5" fill="oklch(0.72 0.17 10 / 0.7)" />
      <path d="M48 76 Q60 88 72 76" stroke="oklch(0.2 0.04 262)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="50" y="4" width="20" height="16" rx="5" fill="oklch(0.82 0.16 80)" />
      <defs>
        <linearGradient id="stomp-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.95 0.05 300)" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="oklch(0.95 0.05 300)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function MiniPiece({ shape, color, unit = 18 }: { shape: Shape; color: number; unit?: number }) {
  const rows = Math.max(...shape.map(([r]) => r)) + 1
  const cols = Math.max(...shape.map(([, c]) => c)) + 1
  return (
    <span className="relative block" style={{ width: cols * unit, height: rows * unit }} aria-hidden="true">
      {shape.map(([r, c]) => (
        <span key={`${r}-${c}`} className="absolute" style={{ top: r * unit, left: c * unit, width: unit, height: unit }}>
          <Block color={color} className="!inset-[1.5px]" />
        </span>
      ))}
    </span>
  )
}

/* ---------------- Main component ---------------- */

type Phase = 'play' | 'drop' | 'stomp' | 'won' | 'stuck'
interface Burst {
  id: number
  r: number
  c: number
  color: number
}

export default function StompMiniToy() {
  const [pIdx, setPIdx] = useState(0)
  const puzzle = PUZZLES[pIdx]
  const [board, setBoard] = useState<Cell[][]>(() => parseGrid(PUZZLES[0].grid))
  const [used, setUsed] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<[number, number] | null>(null)
  const [collected, setCollected] = useState<boolean[]>([false, false, false, false])
  const [clearing, setClearing] = useState<Set<string>>(new Set())
  const [bursts, setBursts] = useState<Burst[]>([])
  const [phase, setPhase] = useState<Phase>('play')
  const [shake, setShake] = useState(0)
  const [muted, setMuted] = useState(false)
  const [moves, setMoves] = useState(0)
  const [announce, setAnnounce] = useState('')
  const play = useSynth(muted)
  const timers = useRef<number[]>([])
  const burstId = useRef(0)

  const later = useCallback((fn: () => void, ms: number) => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    timers.current.push(window.setTimeout(fn, reduce ? Math.min(ms, 60) : ms))
  }, [])
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const piece = puzzle.pieces.find((p) => p.id === selected) ?? null

  const fits = useCallback(
    (shape: Shape, r0: number, c0: number) =>
      shape.every(([dr, dc]) => {
        const r = r0 + dr
        const c = c0 + dc
        return r >= 0 && r < N && c >= 0 && c < N && board[r][c] === null
      }),
    [board],
  )

  const linesAfter = useCallback(
    (shape: Shape, r0: number, c0: number) => {
      const g = board.map((row) => row.slice())
      shape.forEach(([dr, dc]) => (g[r0 + dr][c0 + dc] = 0))
      const rows: number[] = []
      const cols: number[] = []
      for (let i = 0; i < N; i++) {
        if (g[i].every((v) => v !== null)) rows.push(i)
        if (g.every((row) => row[i] !== null)) cols.push(i)
      }
      return { g, rows, cols }
    },
    [board],
  )

  const preview = useMemo(() => {
    if (!piece || !hover || phase !== 'play') return null
    const [r0, c0] = hover
    const ok = fits(piece.shape, r0, c0)
    const cells = new Set(piece.shape.map(([dr, dc]) => `${r0 + dr}-${c0 + dc}`))
    const lines = ok ? linesAfter(piece.shape, r0, c0) : { rows: [] as number[], cols: [] as number[] }
    return { ok, cells, rows: lines.rows, cols: lines.cols }
  }, [piece, hover, phase, fits, linesAfter])

  const anyFit = useCallback(
    (remaining: Piece[], g: Cell[][]) =>
      remaining.some((p) => {
        for (let r = 0; r < N; r++)
          for (let c = 0; c < N; c++)
            if (p.shape.every(([dr, dc]) => r + dr < N && c + dc < N && g[r + dr][c + dc] === null)) return true
        return false
      }),
    [],
  )

  const triggerStomp = useCallback(
    (g: Cell[][]) => {
      setPhase('drop')
      setAnnounce('All golden targets cleared! A Stompling is dropping in…')
      later(() => {
        play('stomp')
        setShake((s) => s + 1)
        setPhase('stomp')
      }, 520)
      later(() => {
        play('stomp')
        setShake((s) => s + 1)
      }, 970)
      later(() => {
        setBoard(g.map((row) => row.map(() => null)))
        setPhase('won')
        play('win')
        setAnnounce('BOOM! STOMPED! Every block is gone.')
      }, 1650)
    },
    [later, play],
  )

  const place = (r0: number, c0: number) => {
    if (!piece || phase !== 'play') return
    if (!fits(piece.shape, r0, c0)) {
      play('nope')
      setAnnounce("That piece doesn't fit there.")
      return
    }
    play('place')
    const { g, rows, cols } = linesAfter(piece.shape, r0, c0)
    piece.shape.forEach(([dr, dc]) => (g[r0 + dr][c0 + dc] = piece.color))
    const nextUsed = [...used, piece.id]
    setUsed(nextUsed)
    setSelected(null)
    setMoves((m) => m + 1)

    const nextCollected = collected.slice()
    if (rows.length || cols.length) {
      const cleared = new Set<string>()
      rows.forEach((r) => {
        for (let c = 0; c < N; c++) cleared.add(`${r}-${c}`)
      })
      cols.forEach((c) => {
        for (let r = 0; r < N; r++) cleared.add(`${r}-${c}`)
      })
      TARGETS.forEach(([tr, tc], i) => {
        if (cleared.has(`${tr}-${tc}`)) nextCollected[i] = true
      })
      setBoard(g)
      setClearing(cleared)
      const newBursts: Burst[] = []
      cleared.forEach((k) => {
        const [r, c] = k.split('-').map(Number)
        newBursts.push({ id: ++burstId.current, r, c, color: g[r][c] ?? 3 })
      })
      setBursts((b) => [...b, ...newBursts])
      const after = g.map((row) => row.slice())
      cleared.forEach((k) => {
        const [r, c] = k.split('-').map(Number)
        after[r][c] = null
      })
      later(() => play('clear'), 60)
      later(() => {
        setBoard(after)
        setClearing(new Set())
        setCollected(nextCollected)
        const ids = new Set(newBursts.map((b) => b.id))
        setBursts((b) => b.filter((x) => !ids.has(x.id)))
        if (nextCollected.every(Boolean)) triggerStomp(after)
        else {
          const remaining = puzzle.pieces.filter((p) => !nextUsed.includes(p.id))
          if (!remaining.length || !anyFit(remaining, after)) {
            setPhase('stuck')
            setAnnounce('Out of moves — try again!')
          } else setAnnounce(`Line cleared! ${nextCollected.filter(Boolean).length} of 4 golden targets collected.`)
        }
      }, 430)
    } else {
      setBoard(g)
      const remaining = puzzle.pieces.filter((p) => !nextUsed.includes(p.id))
      if (!remaining.length || !anyFit(remaining, g)) {
        setPhase('stuck')
        setAnnounce('Out of moves — try again!')
      } else setAnnounce('Piece placed.')
    }
  }

  const reset = (next: number) => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setPIdx(next)
    setBoard(parseGrid(PUZZLES[next].grid))
    setUsed([])
    setSelected(null)
    setHover(null)
    setCollected([false, false, false, false])
    setClearing(new Set())
    setBursts([])
    setPhase('play')
    setMoves(0)
    setAnnounce(`Puzzle ${next + 1} of ${PUZZLES.length}: ${PUZZLES[next].title}. ${PUZZLES[next].hint}`)
  }

  const confetti = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        cx: `${((i * 53) % 160) - 80}px`,
        cr: `${(i * 97) % 720}deg`,
        delay: `${(i % 7) * 0.05}s`,
        color: COLORS[i % COLORS.length].face,
        w: 6 + (i % 3) * 3,
      })),
    [],
  )

  const stompActive = phase === 'drop' || phase === 'stomp' || phase === 'won'
  const collectedCount = collected.filter(Boolean).length

  return (
    <section id="play" aria-labelledby="play-title" className="relative overflow-hidden py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-10 h-[480px] w-[480px] rounded-full bg-coral/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        {/* Copy column */}
        <div>
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-coral-ink">Playable demo · right here</p>
          <h2 id="play-title" className="mt-3 font-display text-[44px] font-bold leading-[0.98] tracking-[-0.015em] sm:text-[58px]">
            Try the Stomp!
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">
            A tiny 6×6 taste of the real 9×9 game. Pick a piece, drop it on the board, and clear lines through the{' '}
            <strong className="text-ink">golden zone</strong>. Collect all four rings and see what happens.
          </p>
          <ol className="mt-7 grid gap-3 text-[15px] font-medium text-ink">
            {['Tap a piece in the tray', 'Tap a board cell to place it (top-left corner)', 'Clear rows or columns through the gold'].map(
              (t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink font-display text-[15px] font-bold text-cream">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ),
            )}
          </ol>
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose a mini-puzzle">
            {PUZZLES.map((p, i) => (
              <button
                key={p.title}
                type="button"
                onClick={() => reset(i)}
                aria-pressed={i === pIdx}
                className={`pill rounded-full px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.06em] ${
                  i === pIdx ? 'bg-ink text-cream' : 'bg-paper text-ink-soft ring-1 ring-ink/10 hover:text-ink'
                }`}
              >
                {i + 1}. {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Toy stage */}
        <div className="relative rounded-[2.5rem] bg-ink p-4 shadow-[0_10px_0_oklch(0.16_0.035_262),0_40px_80px_-30px_oklch(0.2_0.05_262/0.7)] sm:p-7">
          <div className="flex items-center justify-between gap-3 px-1 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-gold">Puzzle {pIdx + 1}/3</span>
              <span className="hidden font-display text-[17px] font-semibold text-cream sm:inline">· {puzzle.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-stage-raised px-3 py-1.5 font-mono text-[12px] font-bold text-gold"
                aria-label={`${collectedCount} of 4 golden targets collected`}
              >
                ◎ {collectedCount}/4
              </span>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={muted}
                aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
                className="grid h-10 w-10 place-items-center rounded-full bg-stage-raised text-cream hover:bg-ink-soft"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                type="button"
                onClick={() => reset(pIdx)}
                aria-label="Restart this puzzle"
                className="grid h-10 w-10 place-items-center rounded-full bg-stage-raised text-cream hover:bg-ink-soft"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Board */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div
              key={shake}
              className={`relative grid aspect-square grid-cols-6 gap-0 rounded-[1.6rem] bg-stage p-2 ring-1 ring-cream/10 ${shake ? 'board-shake' : ''}`}
              role="group"
              aria-label={`6 by 6 puzzle board. ${piece ? `Selected: ${piece.name}.` : 'Select a piece from the tray first.'}`}
              onMouseLeave={() => setHover(null)}
            >
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const k = `${r}-${c}`
                  const tIdx = TARGETS.findIndex(([tr, tc]) => tr === r && tc === c)
                  const target = tIdx >= 0 && !collected[tIdx]
                  const inPrev = preview?.cells.has(k)
                  const inLine = preview?.ok && (preview.rows.includes(r) || preview.cols.includes(c))
                  const flyIdx = r * N + c
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-label={`Row ${r + 1}, column ${c + 1}${cell !== null ? ', filled' : ', empty'}${target ? ', golden target' : ''}`}
                      disabled={phase !== 'play'}
                      onMouseEnter={() => setHover([r, c])}
                      onFocus={() => setHover([r, c])}
                      onClick={() => place(r, c)}
                      className={`relative aspect-square rounded-[22%] focus-visible:z-10 ${piece ? 'cursor-pointer' : 'cursor-default'} ${
                        (r + c) % 2 === 0 ? 'bg-stage-raised/70' : 'bg-stage-raised/40'
                      } ${inLine ? '!bg-gold/35' : ''}`}
                    >
                      {target && (
                        <span aria-hidden="true" className="target-ring absolute inset-[5px] rounded-[26%] bg-gold/15" />
                      )}
                      {isTarget(r, c) && !target && (
                        <Sparkles aria-hidden="true" size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/60" />
                      )}
                      {cell !== null && (
                        <Block
                          color={cell}
                          className={`${clearing.has(k) ? 'cell-clear' : ''} ${phase === 'stomp' ? 'block-fly' : ''}`}
                          style={
                            {
                              '--fx': `${((flyIdx * 47) % 260) - 130}px`,
                              '--fy': `${-80 - ((flyIdx * 31) % 160)}px`,
                              '--fr': `${((flyIdx * 83) % 540) - 270}deg`,
                              animationDelay: phase === 'stomp' ? `${(flyIdx % 9) * 0.025}s` : undefined,
                            } as CSSProperties
                          }
                        />
                      )}
                      {inPrev && piece && cell === null && (
                        <span className={preview?.ok ? 'opacity-55' : 'opacity-0'}>
                          <Block color={piece.color} />
                        </span>
                      )}
                      {inPrev && preview && !preview.ok && (
                        <span aria-hidden="true" className="absolute inset-[3px] rounded-[22%] ring-2 ring-coral/80" />
                      )}
                    </button>
                  )
                }),
              )}

              {/* particles */}
              {bursts.map((b) =>
                Array.from({ length: 5 }, (_, j) => {
                  const ang = (j / 5) * Math.PI * 2 + b.id
                  return (
                    <span
                      key={`${b.id}-${j}`}
                      aria-hidden="true"
                      className="particle pointer-events-none absolute z-20 h-2.5 w-2.5 rounded-[3px]"
                      style={
                        {
                          left: `calc(${((b.c + 0.5) / N) * 100}%)`,
                          top: `calc(${((b.r + 0.5) / N) * 100}%)`,
                          background: COLORS[b.color].face,
                          '--dx': `${Math.cos(ang) * 46}px`,
                          '--dy': `${Math.sin(ang) * 46}px`,
                        } as CSSProperties
                      }
                    />
                  )
                }),
              )}
            </div>

            {/* Stompling */}
            {stompActive && (
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 top-[22%] z-30 h-[46%] w-[46%] ${
                  phase === 'drop' ? 'stompling-drop' : phase === 'stomp' ? 'stompling-stomp' : ''
                }`}
                style={{ transform: 'translate(-50%, 0)' }}
              >
                <StomplingSprite />
              </div>
            )}

            {/* Confetti */}
            {phase === 'won' && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full overflow-visible">
                {confetti.map((p, i) => (
                  <span
                    key={i}
                    className="confetti absolute top-0 rounded-[2px]"
                    style={
                      {
                        left: p.left,
                        width: p.w,
                        height: p.w * 1.6,
                        background: p.color,
                        animationDelay: p.delay,
                        '--cx': p.cx,
                        '--cr': p.cr,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            )}

            {/* Win / stuck overlays */}
            {phase === 'won' && (
              <div className="pop-in absolute inset-x-3 bottom-4 z-40 flex flex-col items-center gap-3 rounded-3xl bg-paper/95 p-4 text-center shadow-2xl backdrop-blur sm:inset-x-8">
                <p className="font-display text-[26px] font-bold leading-tight text-ink">BOOM! STOMPED!</p>
                <p className="text-[14px] font-medium text-ink-soft">Cleared in {moves} moves. That was 1 tiny board — the real game has 200.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href="#download" className="btn-tactile px-5 py-3 text-[16px]">
                    Ready for 200 real levels?
                  </a>
                  <button type="button" onClick={() => reset((pIdx + 1) % PUZZLES.length)} className="btn-tactile btn-gold px-5 py-3 text-[16px]">
                    <RotateCcw size={17} aria-hidden="true" /> Play Again
                  </button>
                </div>
              </div>
            )}
            {phase === 'stuck' && (
              <div className="pop-in absolute inset-x-6 bottom-6 z-40 flex flex-col items-center gap-3 rounded-3xl bg-paper/95 p-5 text-center shadow-2xl">
                <p className="font-display text-[24px] font-bold text-ink">Out of room!</p>
                <p className="text-[14px] font-medium text-ink-soft">{puzzle.hint}</p>
                <button type="button" onClick={() => reset(pIdx)} className="btn-tactile btn-gold px-5 py-3 text-[16px]">
                  <RotateCcw size={17} aria-hidden="true" /> Try again
                </button>
              </div>
            )}
          </div>

          {/* Tray */}
          <div className="mt-5 grid grid-cols-3 gap-3" role="group" aria-label="Piece tray">
            {puzzle.pieces.map((p) => {
              const isUsed = used.includes(p.id)
              const isSel = selected === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={isUsed || phase !== 'play'}
                  aria-pressed={isSel}
                  aria-label={`${p.name}${isUsed ? ' (used)' : ''}`}
                  onClick={() => {
                    setSelected(isSel ? null : p.id)
                    play('place')
                  }}
                  className={`pill grid h-24 place-items-center rounded-2xl transition-all ${
                    isUsed
                      ? 'bg-stage/50 opacity-30'
                      : isSel
                        ? '-translate-y-1 bg-stage-raised ring-[3px] ring-gold shadow-[0_6px_0_oklch(0.66_0.14_70)]'
                        : 'bg-stage-raised/70 ring-1 ring-cream/10 hover:bg-stage-raised'
                  }`}
                >
                  <MiniPiece shape={p.shape} color={p.color} />
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-center text-[14px] font-medium text-cream/85" aria-hidden="true">
            {phase === 'play' ? (piece ? 'Now tap a spot on the board ↑' : puzzle.hint) : phase === 'won' ? 'Every block — stomped flat.' : ' '}
          </p>
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>
    </section>
  )
}
