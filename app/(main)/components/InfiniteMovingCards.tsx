'use clinet';
import Image from "next/image"

const images = [
  {
    alt: 'Aastu',
    src: '/images/partners/aastu.png',
    width: 400,
    height: 100,
  },
  {
    alt: 'Addis Ababa',
    src: '/images/partners/addis-ababa.png',
    width: 400,
    height: 100,
  },
  {
    alt: 'Astu',
    src: '/images/partners/astu.png',
    width: 400,
    height: 100,
  },
  {
    alt: 'Bahir Dar',
    src: '/images/partners/bdr.jpg',
    width: 400,
    height: 100,
  },
  {
    alt: 'Gondar',
    src: '/images/partners/gondar.png',
    width: 400,
    height: 100,
  },
  {
    alt: 'Haromaya',
    src: '/images/partners/haromaya.webp',
    width: 400,
    height: 100,
  },
  {
    alt: 'Unity',
    src: '/images/partners/unity.jpg',
    width: 400,
    height: 100,
  },
  {
    alt: 'Wolayta',
    src: '/images/partners/wolayta.jpg',
    width: 400,
    height: 100,
  },
  {
    alt: 'Hawassa',
    src: '/images/partners/hawassa.jpg',
    width: 400,
    height: 100,
  },
  {
    alt: 'Jimma',
    src: '/images/partners/jimma.png',
    width: 400,
    height: 100,
  },
] 
  
export default function InfiniteMovingCards() {
  return (
    <div className="overflow-hidden fle">
      <ul className="flex gap-20 py-4 animate-scroll w-max">
      {[...images, ...images].map((image, index) => {
        return <li key={index} className="flex gap-2 min-w-fit">
          <div className="w-16 h-16 mx-10">
          <Image className="w-full h-full object-contain" src={image.src} alt={image.alt} width={image.width} height={image.height} />
          </div>
    </li>
      })}
      </ul>
    </div>
  )
}
