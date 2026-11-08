import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import ArticulosSearchPage from './pages/ArticulosSearchPage/ArticulosSearchPage';
import ArticuloFormPage from './pages/ArticuloFormPage/ArticuloFormPage';
import PerfilEditPage from './pages/PerfilEditPage/PerfilEditPage';
import ArticuloDetailPage from './pages/ArticuloDetailPage/ArticuloDetailPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setSelectedArticle(null);
    setIsCreatingArticle(false);
    setIsEditingProfile(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isEditingProfile) {
    return (
      <PerfilEditPage
        onBack={() => setIsEditingProfile(false)}
        onUpdateUser={() => setIsEditingProfile(false)}
      />
    );
  }

  if (isCreatingArticle) {
    return (
      <ArticuloFormPage
        onBack={() => setIsCreatingArticle(false)}
        onArticuloCreado={() => setIsCreatingArticle(false)}
      />
    );
  }

  if (selectedArticle) {
    return (
      <ArticuloDetailPage
        articulo={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ArticulosSearchPage
      onLogout={handleLogout}
      onSelectArticle={(item) => setSelectedArticle(item)}
      onOpenForm={() => setIsCreatingArticle(true)}
      onOpenProfile={() => setIsEditingProfile(true)}
    />
  );
}