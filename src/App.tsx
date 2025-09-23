import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Products Management - Coming Soon</h2></div>} />
            <Route path="categories" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Categories Management - Coming Soon</h2></div>} />
            <Route path="brands" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Brands Management - Coming Soon</h2></div>} />
            <Route path="orders" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Orders Management - Coming Soon</h2></div>} />
            <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Settings - Coming Soon</h2></div>} />
          </Route>

          {/* Public Routes */}
          <Route 
            path="/*" 
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/category/:categoryName" element={<Shop />} />
                  <Route path="/brand/:brandName" element={<Shop />} />
                </Routes>
                <Footer />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;