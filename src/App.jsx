import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Note: Game components have been temporarily removed while we restructure the app.
// Legacy game files are now in public/Oyunlar-legacy/
// TODO: Create new game components in src/components/games/ or use the Home page

export default function App() {
  return (
    <BrowserRouter basename="/NeuranaWorld">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
