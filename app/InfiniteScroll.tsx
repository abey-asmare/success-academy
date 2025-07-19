'use client'
import React from 'react'
import Image from 'next/image'
import styles from './InfiniteScroll.module.css'

const images = [
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
  '/images/partners/aastu204.png',
]

export default function InfiniteScroll() {
  const [imagesState, setImagesState] = React.useState(images)

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollLeft, scrollWidth, clientWidth } =
        event.currentTarget

      if (scrollLeft + clientWidth >= scrollWidth) {
        setImagesState((prevImages) => [...prevImages, ...images])
      }
    },
    [images]
  )

  return (
    <div
      className={styles.marqueeWrapper}
      onScroll={handleScroll}
    >
      <div className={styles.marquee}>
        <div className={styles.track}>
          {imagesState.map((src, i) => (
            <div key={i} className={styles.imageWrapper}>
              <Image src={src} alt={`Partner ${i}`} width={200} height={100} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
