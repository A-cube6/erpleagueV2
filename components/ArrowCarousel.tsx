'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { ReactNode } from 'react';

type ArrowCarouselProps = {
  title: string;
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
};

export function ArrowCarousel({
  title,
  children,
  className = '',
  trackClassName = '',
  ariaLabel
}: ArrowCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>('[data-carousel-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth : 320;
    const gap = 18;
    const amount = cardWidth + gap;

    track.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`arrow-carousel ${className}`}>
      <div className="arrow-carousel-head">
        <div>{title ? <span className="sr-only">{title}</span> : null}</div>
        <div className="arrow-carousel-controls" aria-label={`${title} carousel controls`}>
          <button
            type="button"
            className="carousel-arrow"
            aria-label={`Previous ${title}`}
            onClick={() => move('prev')}
          >
            <ChevronLeft size={20} strokeWidth={2.3} />
          </button>
          <button
            type="button"
            className="carousel-arrow"
            aria-label={`Next ${title}`}
            onClick={() => move('next')}
          >
            <ChevronRight size={20} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`arrow-carousel-track ${trackClassName}`}
        aria-label={ariaLabel || title}
      >
        {children}
      </div>
    </div>
  );
}
