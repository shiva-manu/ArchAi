import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { DocsPage } from '@/pages/DocsPage'
import { PricingPage } from '@/pages/PricingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
    </Routes>
  )
}

export default App
