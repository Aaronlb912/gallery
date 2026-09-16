import { useState } from 'react'
import { Gallery, normalizeGallery, sampleGallery } from './lib/index.js'

export default function App() {
  const [gallery, setGallery] = useState(() => normalizeGallery(sampleGallery))

  return (
    <Gallery
      value={gallery}
      onChange={(next) => setGallery(normalizeGallery(next))}
    />
  )
}
