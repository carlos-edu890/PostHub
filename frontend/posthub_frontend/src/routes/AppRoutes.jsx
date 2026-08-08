import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas Públicas
import Home from '../pages/Home';
import PostDetail from '../pages/PostDetail';
import Search from '../pages/Search';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Páginas Privadas
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import MyPosts from '../pages/MyPosts';
import Profile from '../pages/Profile';

// Guard de Rotas
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/busca" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/contato" element={<Contact />} />

      {/* Rotas Protegidas (Exigem Autenticação) */}
      <Route
        path="/criar-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editar-post/:id"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meus-posts"
        element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Redirecionamento para Home caso rota não exista */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
