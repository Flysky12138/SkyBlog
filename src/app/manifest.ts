import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#ffffff',
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
    display: 'standalone',
    icons: [
      { sizes: '48x48', src: 'icons/icon-48x48.png', type: 'image/png' },
      { sizes: '72x72', src: 'icons/icon-72x72.png', type: 'image/png' },
      { sizes: '96x96', src: 'icons/icon-96x96.png', type: 'image/png' },
      { sizes: '128x128', src: 'icons/icon-128x128.png', type: 'image/png' },
      { sizes: '144x144', src: 'icons/icon-144x144.png', type: 'image/png' },
      { sizes: '152x152', src: 'icons/icon-152x152.png', type: 'image/png' },
      { sizes: '192x192', src: 'icons/icon-192x192.png', type: 'image/png' },
      { sizes: '256x256', src: 'icons/icon-256x256.png', type: 'image/png' },
      { sizes: '384x384', src: 'icons/icon-384x384.png', type: 'image/png' },
      { sizes: '512x512', src: 'icons/icon-512x512.png', type: 'image/png' }
    ],
    name: process.env.NEXT_PUBLIC_TITLE,
    short_name: process.env.NEXT_PUBLIC_TITLE,
    start_url: '/',
    theme_color: '#ffffff'
  }
}
