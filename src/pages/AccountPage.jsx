// src/pages/AccountPage.jsx
import React from 'react';
import './AccountPage.css'; // Импортируем стили

export default function AccountPage({ user }) {
  return (
    <div className="account-container">
      <div className="account-card">
        
        <h2 className="account-title">
          Профиль сотрудника
        </h2>
        
        <div className="account-fields">
          <div>
            <span className="account-label">Имя и Фамилия</span>
            <span className="account-value-bold">
              {user.first_name} {user.second_name}
            </span>
          </div>

          <div>
            <span className="account-label">Логин / Email</span>
            <span className="account-value">
              {user.email}
            </span>
          </div>

          <div>
            <span className="account-label">Специализация</span>
            <span className="account-badge">
              {user.specialization}
            </span>
          </div>

          <div>
            <span className="account-label">Номер телефона</span>
            <span className="account-value">
              {user.phone_number}
            </span>
          </div>

          <div>
            <span className="account-label">Дата рождения</span>
            <span className="account-value">
              {user.birth_date}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
