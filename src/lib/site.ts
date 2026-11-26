export const SITE = {
  name: 'Stomplings: Make Room!',
  shortName: 'Stomplings',
  studio: 'Dizzywalk',
  url: 'https://playstomplings.com',
  downloadUrl: 'https://playstomplings.com/#download',
  appStore: 'https://apps.apple.com/us/app/stomplings-make-room/id6834582552',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.dizzywalk.stomplings',
  privacy: 'https://dizzywalk-legal.onrender.com/privacy/stomplings.html',
  supportEmail: 'support@dizzywalk.com',
  description:
    'Clear lines, cover the golden target rings, make room on the 9×9 board, and watch adorable giant blocky Stomplings drop in and STOMP every remaining block off the board! 20 worlds, 200 levels, free on iOS & Android.',
} as const

export const STATS = [
  { value: '20', label: 'Hand-crafted worlds' },
  { value: '200', label: 'Authored levels' },
  { value: '48', label: 'Album cards' },
  { value: '48', label: 'Village builds' },
] as const

export type Mechanic = 'Mini Stompling Rescue' | 'Gem Harvest' | 'Blast Kegs' | 'Frost Ice'

export interface World {
  n: number
  name: string
  accent: string
  bg?: string
  shot?: string
  shotLabel?: string
  /** Twist highlighted for this world in the explorer. */
  mechanic?: Mechanic
  blurb?: string
}

/** Each world holds 10 authored levels: World n = Lv (n-1)*10+1 – n*10. */
export const levelRange = (n: number) => `Lv ${(n - 1) * 10 + 1}–${n * 10}`

export const WORLDS: World[] = [
  { n: 1, name: 'Sunny Meadow', accent: '#7BC74D' },
  { n: 2, name: 'Coral Beach', accent: '#FF8A65' },
  { n: 3, name: 'Frost Peak', accent: '#7EC8F0' },
  { n: 4, name: 'Sunset Canyon', accent: '#F28C38' },
  { n: 5, name: 'Harvest Orchard', accent: '#E0A43A' },
  { n: 6, name: 'Starlight Keep', accent: '#8A9BF5' },
  { n: 7, name: 'Sakura Garden', accent: '#F49AC1' },
  { n: 8, name: 'Candy Clouds', accent: '#F6A6D7' },
  { n: 9, name: 'Ember Volcano', accent: '#FF5A4E' },
  { n: 10, name: 'Sunken Atlantis', accent: '#3FC1C9' },
  {
    n: 11,
    name: 'Mushroom Hollow',
    accent: '#E86A5C',
    bg: '/img/worlds/bg_mushroom.webp',
    shot: '/img/shots/lv102-mushroom.webp',
    shotLabel: 'Level 102 · live device capture',
    mechanic: 'Mini Stompling Rescue',
    blurb: 'Glowing toadstools, mossy logs and caged Mini Stomplings waiting for a hero.',
  },
  {
    n: 12,
    name: 'Aurora Bay',
    accent: '#5FE0C8',
    bg: '/img/worlds/bg_aurora.webp',
    mechanic: 'Frost Ice',
    blurb: 'Ribbons of northern light ripple over a frozen harbor of icy cells.',
  },
  {
    n: 13,
    name: 'Pirate Lagoon',
    accent: '#F5B727',
    bg: '/img/worlds/bg_lagoon.webp',
    mechanic: 'Blast Kegs',
    blurb: 'Treasure coves, rope bridges and kegs that go BOOM when a line runs through them.',
  },
  {
    n: 14,
    name: 'Crystal Caverns',
    accent: '#9FD8FF',
    bg: '/img/worlds/bg_crystal.webp',
    shot: '/img/shots/lv132-crystal.webp',
    shotLabel: 'Level 132 · live device capture',
    mechanic: 'Gem Harvest',
    blurb: 'Deep, glittering tunnels where every cleared line can harvest a gem.',
  },
  {
    n: 15,
    name: 'Clockwork City',
    accent: '#D9A25A',
    bg: '/img/worlds/bg_clockwork.webp',
    mechanic: 'Blast Kegs',
    blurb: 'Brass gears, ticking towers and a skyline that whirs as you clear.',
  },
  {
    n: 16,
    name: 'Jungle Ruins',
    accent: '#6CCB5F',
    bg: '/img/worlds/bg_jungle.webp',
    mechanic: 'Mini Stompling Rescue',
    blurb: 'Vine-wrapped temples hiding more little Stomplings to set free.',
  },
  {
    n: 17,
    name: 'Cloud Kingdom',
    accent: '#B9D7FF',
    bg: '/img/worlds/bg_cloud.webp',
    mechanic: 'Gem Harvest',
    blurb: 'Floating castles and soft cumulus boards high above the map.',
  },
  {
    n: 18,
    name: 'Neon Arcade',
    accent: '#47E6FF',
    bg: '/img/worlds/bg_neon.webp',
    mechanic: 'Frost Ice',
    blurb: 'Glowing cabinets, buzzing signs and boards that light up with every clear.',
  },
  {
    n: 19,
    name: 'Pumpkin Manor',
    accent: '#FF8F3C',
    bg: '/img/worlds/bg_manor.webp',
    mechanic: 'Blast Kegs',
    blurb: 'A cozy-spooky estate of lanterns, pumpkins and creaky corridors.',
  },
  {
    n: 20,
    name: 'Rainbow Summit',
    accent: '#FFD45C',
    bg: '/img/worlds/bg_rainbow.webp',
    mechanic: 'Gem Harvest',
    blurb: 'The grand finale: a shimmering peak at the top of all 200 levels.',
  },
]

export const MECHANIC_ICON: Record<Mechanic, string> = {
  'Mini Stompling Rescue': '/img/icons/twist_mini_cage.webp',
  'Gem Harvest': '/img/icons/twist_gem_cell.webp',
  'Blast Kegs': '/img/icons/twist_tnt_keg.webp',
  'Frost Ice': '/img/icons/twist_frost_ice.webp',
}
