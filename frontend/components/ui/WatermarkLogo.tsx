import { cn } from '@/lib/shadcn-utils'

interface WatermarkLogoProps {
  /** Clases de tamaño/posición extra (ej. h-8) */
  className?: string
}

/** Logo del club superpuesto como marca de agua (esquina inferior derecha). */
const WatermarkLogo = ({ className }: WatermarkLogoProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/assets/circular-transparent.svg"
    alt=""
    aria-hidden="true"
    draggable={false}
    className={cn(
      'pointer-events-none absolute bottom-2 right-2 z-10 w-auto select-none opacity-90 drop-shadow-md',
      className
    )}
  />
)

export { WatermarkLogo }
