// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StaffPage from "./pages/StaffPage.jsx";

function App() {
  return (
    <Router>
      {/* Простая навигационная панель для перехода */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Главная</Link>
        <Link to="/staff" style={{ textDecoration: 'none', color: '#dc3545', fontWeight: 'bold' }}>Работники Салона</Link>
      </nav>

      {/* Определение маршрутов */}
      <Routes>
        {/* Главная страница (заглушка) */}
        <Route path="/" element={
          <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '24px', lineHeight: '1.4' }}>Добро пожаловать в систему управления салоном красоты</h1>
            <p style={{ lineHeight: '1.8', color: '#555' }}>Нажмите на «Работники Салона» в меню выше, чтобы перейти к таблице.</p>
          </div>
        } />

        {/* Наша созданная страница с CRUD операциями */}
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;

// npm config set proxy http://192.168.40.21:8080
// npm config set https-proxy http://192.168.40.21:8080
// npm config delete registry
// npm config set registry