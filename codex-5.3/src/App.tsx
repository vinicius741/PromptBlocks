import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BuilderPage } from './pages/BuilderPage'
import { ProgramsPage } from './pages/ProgramsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/programs" replace />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/builder/:programId" element={<BuilderPage />} />
        <Route path="*" element={<Navigate to="/programs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
