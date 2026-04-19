import { Routes, Route } from 'react-router-dom';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { BuilderPage } from '@/pages/BuilderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProgramsPage />} />
      <Route path="/builder/:programId" element={<BuilderPage />} />
    </Routes>
  );
}

export default App;