import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProgramsPage from './pages/ProgramsPage';
import BuilderPage from './pages/BuilderPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/builder/:programId" element={<BuilderPage />} />
          <Route path="*" element={<Navigate to="/programs" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
