import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgramsPage } from './pages/ProgramsPage'
import { BuilderPage } from './pages/BuilderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/builder/:programId" element={<BuilderPage />} />
        <Route path="*" element={<Navigate to="/programs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
