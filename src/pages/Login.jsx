// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css'; // Подключаем внешний CSS-файл

const LOGIN_API_URL = 'http://localhost:5000/api/login';
const STAFF_API_URL = 'http://localhost:5000/api/staff';
const ACCOUNTS_API_URL = 'http://localhost:5000/api/accounts';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Шаг 1: Авторизуемся на сервере
      const loginResponse = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.error || 'Неверный Email или Password');
        return;
      }

      // Шаг 2: Успешный вход. Получаем список аккаунтов, чтобы узнать staff_id пользователя
      const accountsResponse = await fetch(ACCOUNTS_API_URL);
      const accountsData = await accountsResponse.json();
      
      const currentAccount = accountsData.find(acc => acc.email === loginData.email);

      // Шаг 3: Получаем данные сотрудников, чтобы забрать ФИО и специализацию
      const staffResponse = await fetch(STAFF_API_URL);
      const staffData = await staffResponse.json();

      const currentStaff = staffData.find(st => st.id === currentAccount?.staff_id);

      // Шаг 4: Передаем собранный объект в state корневого компонента App.jsx
      onLoginSuccess({
        email: loginData.email,
        id: currentAccount?.id || 1,
        staffId: currentAccount?.staff_id || 1,
        first_name: currentStaff ? currentStaff.first_name : "Не указано",
        second_name: currentStaff ? currentStaff.second_name : "Не указано",
        specialization: currentStaff ? currentStaff.specialization : "Пользователь",
        phone_number: currentStaff ? currentStaff.phone_number : "—",
        birth_date: currentStaff ? currentStaff.birth_date : "—"
      });

      // Перенаправляем на страницу просмотра аккаунта
      navigate('/account');

    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError('Не удалось связаться с бэкенд-сервером');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <h1 className="login-title">Welcome</h1>
        <p className="login-subtitle">Login to get started!</p>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-input-group-large">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>

        <div className="login-footer">
          First time here?{' '}
          <Link to="/register" className="login-link" style={{ textDecoration: 'none' }}>
            Create your account.
          </Link>
        </div>

      </div>
    </div>
  );
}
