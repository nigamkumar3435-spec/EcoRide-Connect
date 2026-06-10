import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Stations from './pages/Stations';
import StationDetail from './pages/StationDetail';
import BatteryStations from './pages/BatteryStations';
import ServiceCenters from './pages/ServiceCenters';
import Forum from './pages/Forum';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-400 transition-colors duration-300">
            {/* Global Navbar */}
            <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/stations" element={<Stations />} />
              <Route path="/stations/:id" element={<StationDetail />} />
              <Route path="/swaps" element={<BatteryStations />} />
              <Route path="/services" element={<ServiceCenters />} />
              
              <Route path="/forum" element={<Forum />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />

              {/* Protected Regular User Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Administrator Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
