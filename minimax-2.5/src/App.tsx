import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgramsPage } from './pages/ProgramsPage';
import { BuilderPage } from './pages/BuilderPage';
import { getAllPrograms } from './lib/storage';
import { Program } from './types/blocks';

const App: React.FC = () => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    setPrograms(getAllPrograms());
  }, [refreshKey]);

  const handleProgramsChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/programs"
          element={
            <ProgramsPage
              programs={programs}
              onProgramsChange={handleProgramsChange}
            />
          }
        />
        <Route
          path="/builder/:programId"
          element={<BuilderPage />}
        />
        <Route
          path="*"
          element={<Navigate to="/programs" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
