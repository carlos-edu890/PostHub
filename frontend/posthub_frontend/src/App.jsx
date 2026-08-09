import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <Navbar />
          <main className="pb-12">
            <AppRoutes />
          </main>
          <AuthModal />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
