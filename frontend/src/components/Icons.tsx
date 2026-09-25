// 内联 SVG 图标（lucide 风格描边），避免引入图标库依赖
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = ({ size = 18, ...rest }: IconProps) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...rest,
})

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const StarIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M11.5 2.6a.6.6 0 0 1 1 0l2.8 5.6 6.2.9a.6.6 0 0 1 .3 1l-4.5 4.4 1 6.2a.6.6 0 0 1-.8.6L12 18.4l-5.5 2.9a.6.6 0 0 1-.8-.6l1-6.2-4.5-4.4a.6.6 0 0 1 .3-1l6.2-.9z" />
  </svg>
)

export const HeartIcon = ({ filled, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z" />
  </svg>
)

export const FilmIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18M17 3v18M3 7.5h4M17 7.5h4M3 16.5h4M17 16.5h4M3 12h18" />
  </svg>
)

export const ClapperIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1-.3 2.1.2 2.4 1.2Z" />
    <path d="m6.2 5.3 3.1 3.9M12.4 3.4l3.1 4" />
    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
)

export const CompassIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const UsersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </svg>
)

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M9 22V12h6v10" />
  </svg>
)

export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect width="7" height="7" x="3" y="3" rx="1.5" />
    <rect width="7" height="7" x="14" y="3" rx="1.5" />
    <rect width="7" height="7" x="14" y="14" rx="1.5" />
    <rect width="7" height="7" x="3" y="14" rx="1.5" />
  </svg>
)

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M18 17V9M13 17V5M8 17v-3" />
  </svg>
)

export const TagsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 5 6 6-9.4 9.4a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8Z" />
    <path d="m16 8 2-2" />
    <circle cx="8.5" cy="12.5" r="0.8" fill="currentColor" />
  </svg>
)

export const FlameIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3 1.1-2.2 2.6-3.5 5-4-.5 2 .5 3.5 2 5 1.5 1.6 2 3.2 2 5a7 7 0 1 1-14 0c0-1.2.5-2.3 1.5-3 .3 1.4 1 2.4 2.5 2.5Z" />
  </svg>
)

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M12 5v14" />
  </svg>
)

export const PencilIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 3a2.9 2.9 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
)

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
  </svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const XIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

export const LogOutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M18.4 5.6l-2.2 2.2M7.8 16.2l-2.2 2.2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
