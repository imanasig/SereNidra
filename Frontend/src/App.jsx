import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuoteGenerator from './components/QuoteGenerator';
import ProtectedRoute from './components/ProtectedRoute';

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
              <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900"><QuoteGenerator /></div>
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for navigation links */}
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center text-2xl">About Page Placeholder</div>} />
        <Route path="/features" element={<div className="min-h-screen flex items-center justify-center text-2xl">Features Page Placeholder</div>} />
        <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center text-2xl">Pricing Page Placeholder</div>} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center text-2xl">Contact Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
