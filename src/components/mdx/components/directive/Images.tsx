'use client'

import { deepTraversalReactElement } from '@/lib/dom/react'
import { ImageViewerContext } from '@/provider/image-viewer'
import { Chip } from '@mui/joy'
import React from 'react'

interface ImagesProps {
  children: React.ReactNode
  className?: string
  defaultAlt?: string
}

export default function Images({ children, className, defaultAlt }: ImagesProps) {
  const images: React.ReactElement[] = []

  deepTraversalReactElement(children, node => {
    if (!React.isValidElement(node)) return
    if (node.props.src) images.push(node)
  })

  const { openViewer } = React.useContext(ImageViewerContext)

  return (
    <section className={className}>
      <div
        className="relative overflow-clip rounded-lg [&_img]:m-0 [&_img]:transition-transform [&_img]:hover:scale-110"
        role="button"
        onClick={() => {
          openViewer({
            images: images.map(({ props }, key) => ({ key, src: props.src })),
            overlayRender: ({ index }) => <p className="text-wrap break-all">{defaultAlt || images[index].props.alt}</p>
          })
        }}
      >
        {images[0]}
        {images.length > 0 && <Chip className="absolute bottom-1 right-1">{images.length}</Chip>}
      </div>
    </section>
  )
}
