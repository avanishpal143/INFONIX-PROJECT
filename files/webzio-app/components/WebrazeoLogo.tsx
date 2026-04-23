'use client'
import Image from 'next/image'

interface WebrazeoLogoProps {
  size?: number
  showText?: boolean
  variant?: 'full' | 'icon'
}

export default function WebrazeoLogo({
  size = 32,
  showText = true,
  variant = 'full',
}: WebrazeoLogoProps) {
  // Use full logo (with text) when showText is true
  if (showText || variant === 'full') {
    return (
      <Image
        src="/webrazeo.png"
        alt="Webrazeo"
        width={size * 4}
        height={size}
        style={{ objectFit: 'contain', height: size, width: 'auto' }}
        priority
      />
    )
  }

  // Icon only
  return (
    <Image
      src="/logo.png"
      alt="Webrazeo"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
