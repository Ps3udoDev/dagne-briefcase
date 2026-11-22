'use client';

import { useState, type ReactNode } from 'react';

export interface ResilientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallback?: ReactNode;
}

/**
 * Renderiza imágenes remotas (Supabase Storage / URLs externas) directamente
 * sin depender del proxy /_next/image, aplicando fetchPriority="high" para LCP
 * y loading="lazy" para imágenes bajo el pliegue, con respaldo elegante ante errores.
 */
export function ResilientImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fallback = null,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
