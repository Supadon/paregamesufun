'use client'

import { useEffect, useRef } from 'react'

export default function StarField() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    // Clear existing stars
    layer.innerHTML = ''

    for (let i = 0; i < 55; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 1.8 + 0.6
      const color = Math.random() > 0.5 ? 'var(--star)' : 'var(--star2)'
      star.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${2 + Math.random() * 4}s linear infinite;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${0.1 + Math.random() * 0.4};
      `
      layer.appendChild(star)
    }
  }, [])

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  )
}
