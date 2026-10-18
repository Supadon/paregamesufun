'use client'

import { useEffect, useRef, useState } from 'react'
import type { HTMLAttributes, ReactNode, CSSProperties } from 'react'

interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Accent color for glow / spotlight (any CSS color). */
  accent?: string
  /** Max tilt in degrees. */
  tilt?: number
  /** Deprecated optional flag for backward compatibility */
  showCorners?: boolean
}

/**
 * Shared card shell — gives every card on the site the same signature
 * interaction: cursor spotlight, subtle 3D tilt + lift, shine sweep,
 * and a dynamic aura ring (styles in globals.css).
 */
export default function ThemedCard({
  children,
  accent = '#4a7fff',
  tilt = 5,
  showCorners,
  className = '',
  style,
  ...rest
}: ThemedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    const rx = (0.5 - y) * tilt * 2
    const ry = (x - 0.5) * tilt * 2
    setTransform(`perspective(900px) translateY(-6px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`)
  }

  const handleLeave = () => setTransform('')

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`themed-card ${className}`}
      style={{ '--card-accent': accent, transform: transform || undefined, ...style } as CSSProperties}
      {...rest}
    >
      {children}
      <span className="themed-card__spot" aria-hidden />
      <span className="themed-card__rim" aria-hidden />
      <span className="themed-card__shine" aria-hidden />
    </div>
  )
}

/** Poster image that gracefully falls back (to children) if the file is missing. */
export function PosterImage({
  src,
  alt,
  className = '',
  fallback,
}: {
  src?: string
  alt: string
  className?: string
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // An image that already failed before hydration never fires onError in React,
  // so detect it on mount.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth === 0) setFailed(true)
  }, [src])

  if (!src || failed) return <>{fallback}</>
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
