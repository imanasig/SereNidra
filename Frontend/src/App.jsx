import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import QuoteGenerator from './components/QuoteGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generate" element={<div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900"><QuoteGenerator /></div>} />
        {/* Placeholder routes for navigation links */}
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center text-2xl">Login Page Placeholder</div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center text-2xl">About Page Placeholder</div>} />
        <Route path="/features" element={<div className="min-h-screen flex items-center justify-center text-2xl">Features Page Placeholder</div>} />
        <Route path="/pricing" element={<div className="min-h-screen flex items-center justify-center text-2xl">Pricing Page Placeholder</div>} />
        <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center text-2xl">Contact Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
