import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProgramsPage from "./pages/ProgramsPage";
import BuilderPage from "./pages/BuilderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/programs" />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/builder/:programId" element={<BuilderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
