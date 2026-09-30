// src/pages/StaffPage.jsx
import { useState, useEffect } from 'react';
import './StaffPage.css'; // Импортируем внешние стили

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
    if (!formData.first_name || !formData.second_name || !formData.specialization) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchStaff();
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
        fetchStaff();
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  return (
    <div className="staff-container">
      
      {/* Форма добавления */}
      <form onSubmit={handleAddUser} className="staff-form">
        <button type="submit" className="staff-add-btn">
          Add User
        </button>
        
        <div className="staff-form-group">
          <label className="staff-form-label">First Name</label>
          <input 
            type="text" 
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="staff-form-input w-140" 
          />
        </div>

        <div className="staff-form-group">
          <label className="staff-form-label">Second Name</label>
          <input 
            type="text" 
            required
            value={formData.second_name}
            onChange={(e) => setFormData({ ...formData, second_name: e.target.value })}
            className="staff-form-input w-140" 
          />
        </div>

        <div className="staff-form-group">
          <label className="staff-form-label">Specialization</label>
          <input 
            type="text" 
            required
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            className="staff-form-input w-180" 
          />
        </div>

        <div className="staff-form-group">
          <label className="staff-form-label">Birth Date</label>
          <input 
            type="date" 
            value={formData.birth_date}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            className="staff-form-input w-140" 
          />
        </div>

        <div className="staff-form-group">
          <label className="staff-form-label">Phone Number</label>
          <input 
            type="text" 
            placeholder="+375 (29) XXX-XX-XX"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="staff-form-input w-160" 
          />
        </div>
      </form>

      {/* Заголовок таблицы */}
      <h2 className="staff-title">Staff Members</h2>

      {/* Таблица */}
      <table className="staff-table">
        <thead>
          <tr className="staff-table-thead-tr">
            <th className="staff-th-id">Id</th>
            <th>First Name</th>
            <th>Second Name</th>
            <th>Specialization</th>
            <th>Birth Date</th>
            <th>Phone Number</th>
            <th className="staff-th-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((employee, index) => (
            <tr 
              key={employee.id} 
              className={`staff-table-tbody-tr ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}
            >
              <td className="staff-td-id">{employee.id}</td>
              <td>{employee.first_name}</td>
              <td>{employee.second_name}</td>
              <td className="staff-td-specialization">{employee.specialization}</td>
              <td>
                {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('ru-RU') : '—'}
              </td>
              <td className="staff-td-phone">{employee.phone_number || '—'}</td>
              <td>
                <button 
                  onClick={() => handleDelete(employee.id)}
                  className="staff-delete-btn"
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
