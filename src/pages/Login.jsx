// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGIN_API_URL = 'http://localhost:5000/api/login';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Успешный вход — сохраняем сессию и перенаправляем на таблицу сотрудников
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', data.email);
        navigate('/staff');
      } else {
        // Выводим ошибку от бэкенда (например, если неверный пароль)
        setError(data.error || 'Неверные учетные данные');
      }
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError('Не удалось связаться с сервером');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ width: '320px', padding: '20px' }}>
        
        {/* Заголовок как на картинке */}
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#333' }}>
          Welcome
        </h1>
        <p style={{ fontSize: '15px', color: '#666', margin: '0 0 40px 0' }}>
          Login to get started!
        </p>

        {/* Форма авторизации */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '25px' }}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                padding: '10px 0',
                fontSize: '16px',
                outline: 'none',
                color: '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '45px' }}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                padding: '10px 0',
                fontSize: '16px',
                outline: 'none',
                color: '#333'
              }}
            />
          </div>

          {/* Отображение ошибки в случае неверных данных */}
          {error && (
            <p style={{ color: '#dc3545', fontSize: '14px', margin: '-30px 0 30px 0' }}>
              {error}
            </p>
          )}

          {/* Кнопка Login как на картинке */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
            <button
              type="submit"
              style={{
                background: 'transparent',
                border: '2px solid #b82a5c', // Тонкая малиновая рамка
                color: '#b82a5c',
                padding: '10px 45px',
                fontSize: '16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Login
            </button>
          </div>
        </form>

        {/* Нижний колонтитул как на картинке */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          borderTop: '1px solid #f1f1f1',
          paddingTop: '20px'
        }}>
          First time here? <span style={{ color: '#b82a5c', cursor: 'pointer' }}>Create your account.</span>
        </div>

      </div>
    </div>
  );
}
