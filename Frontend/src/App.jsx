import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import MeditationForm from './components/MeditationForm';
import ProtectedRoute from './components/ProtectedRoute';

import MeditationDetailsPage from './pages/MeditationDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50"><MeditationForm /></div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/session/:id"
          element={
            <ProtectedRoute>
              <MeditationDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for navigation links */}
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<div className="min-h-screen flex items-center justify-center text-2xl">Features Page Placeholder</div>} />
        <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center text-2xl">Pricing Page Placeholder</div>} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center text-2xl">Contact Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
