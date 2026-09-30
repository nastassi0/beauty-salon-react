// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Используем те же стили для единообразия интерфейса

const REGISTER_API_URL = 'http://localhost:5000/api/register';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          staff_id: staffId 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Аккаунт успешно создан! Перенаправление...');
        setTimeout(() => {
          navigate('/login'); // Перебрасываем на логин через 2 секунды
        }, 2000);
      } else {
        setError(data.error || 'Ошибка при регистрации');
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError('Не удалось связаться с сервером');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Register</h1>
        <p className="login-subtitle">Create an account to get started!</p>

        <form onSubmit={handleRegister}>
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

          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-input-group-large">
            <input
              type="number"
              placeholder="Your Staff ID (e.g. 1, 2)"
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Sign Up
            </button>
          </div>
        </form>

        <div className="login-footer">
          Already have an account?{' '}
          <span 
            onClick={() => navigate('/login')} 
            className="login-link" 
            style={{ textDecoration: 'none', fontWeight: 'bold' }}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
