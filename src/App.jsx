// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import StaffPage from "./pages/StaffPage.jsx";
import LoginPage from './pages/Login.jsx';
import AccountPage from './pages/AccountPage.jsx'; 
import RegisterPage from './pages/Register.jsx';
import './App.css'; // Подключаем внешние стили

function App() {
  // Выполняем требование: хранение информации о пользователе в state корневого компонента
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      {/* Простая навигационная панель для перехода */}
      <nav className="navbar">
        <NavLink to="/" className="nav-link-main">Главная</NavLink>
        <NavLink to="/staff" className="nav-link-staff">Работники Салона</NavLink>
        
        {/* Переключаем кнопки в зависимости от того, вошел ли пользователь */}
        {!currentUser ? (
          <NavLink to="/login" className="nav-link-login">Войти</NavLink>
        ) : (
          <>
            <NavLink to="/account" className="nav-link-account">Мой Аккаунт</NavLink>
            <button onClick={handleLogout} className="logout-btn">
              Выйти {currentUser.first_name ? `(${currentUser.first_name})` : ''}
            </button>
          </>
        )}
      </nav>

      {/* Определение маршрутов */}
      <Routes>
        {/* Главная страница (заглушка) */}
        <Route path="/" element={
          <div className="home-container">
            <h1 className="home-title">Добро пожаловать в систему управления салоном красоты</h1>
            <p className="home-text">Нажмите на «Работники Салона» в меню выше, чтобы перейти к таблице.</p>
          </div>
        } />

        {/* Наша созданная страница с CRUD операциями */}
        <Route path="/staff" element={<StaffPage />} />
        
        {/* Страница авторизации — передаем функцию сохранения пользователя в стейт */}
        <Route path="/login" element={<LoginPage onLoginSuccess={setCurrentUser} />} />

        {/* Страница просмотра данных аккаунта */}
        <Route path="/account" element={currentUser ? <AccountPage user={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
