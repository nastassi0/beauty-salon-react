// src/pages/staff.jsx
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/staff';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    specialization: '',
    birth_date: '',
    phone_number: ''
  });

  // 1. READ ALL: Загрузка списка сотрудников при монтировании страницы
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Ошибка при получении списка сотрудников:', error);
    }
  };

  // 2. CREATE: Добавление нового сотрудника через форму со всеми реальными полями
  const handleAddUser = async (e) => {
    e.preventDefault();
    // Проверяем обязательные текстовые поля перед отправкой
    if (!formData.first_name || !formData.second_name || !formData.specialization) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Отправляем объект со всеми полями формы
      });

      if (response.ok) {
        fetchStaff(); // Перезапрашиваем актуальный список у сервера
        // Полностью очищаем форму
        setFormData({ 
          first_name: '', 
          second_name: '', 
          specialization: '', 
          birth_date: '', 
          phone_number: '' 
        }); 
      }
    } catch (error) {
      console.error('Ошибка при добавлении:', error);
    }
  };

  // 3. DELETE: Удаление сотрудника
  const handleDelete = async (id) => {
    try {
      const numericId = Number(id);
      const response = await fetch(`${API_URL}/${numericId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchStaff(); // Синхронизируем состояние с сервером
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px' }}>
      
      {/* Форма добавления, расширенная под все поля сущности */}
      <form onSubmit={handleAddUser} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '15px', marginBottom: '40px' }}>
        <button 
          type="submit" 
          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '36px' }}
        >
          Add User
        </button>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>First Name</label>
          <input 
            type="text" 
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '140px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Second Name</label>
          <input 
            type="text" 
            required
            value={formData.second_name}
            onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '140px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Specialization</label>
          <input 
            type="text" 
            required
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '180px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Birth Date</label>
          <input 
            type="date" 
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '7px', borderRadius: '4px', width: '140px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Phone Number</label>
          <input 
            type="text" 
            placeholder="+375 (29) XXX-XX-XX"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px', width: '160px' }} 
          />
        </div>
      </form>

      {/* Заголовок таблицы */}
      <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'normal' }}>Staff Members</h2>

      {/* Таблица со всеми вашими колонками */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eaeaea' }}>
            <th style={{ padding: '12px 10px', width: '50px' }}>Id</th>
            <th style={{ padding: '12px 10px' }}>First Name</th>
            <th style={{ padding: '12px 10px' }}>Second Name</th>
            <th style={{ padding: '12px 10px' }}>Specialization</th>
            <th style={{ padding: '12px 10px' }}>Birth Date</th>
            <th style={{ padding: '12px 10px' }}>Phone Number</th>
            <th style={{ padding: '12px 10px', width: '100px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((employee, index) => (
            <tr 
              key={employee.id} 
              style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}
            >
              <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{employee.id}</td>
              <td style={{ padding: '15px 10px' }}>{employee.first_name}</td>
              <td style={{ padding: '15px 10px' }}>{employee.second_name}</td>
              <td style={{ padding: '15px 10px', color: '#0070f3' }}>{employee.specialization}</td>
              <td style={{ padding: '15px 10px' }}>
                {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('ru-RU') : '—'}
              </td>
              <td style={{ padding: '15px 10px', color: '#333' }}>{employee.phone_number || '—'}</td>
              <td style={{ padding: '15px 10px' }}>
                <button 
                  onClick={() => handleDelete(employee.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}


