// src/app/service.js
import http from 'http';

const BeautySalonAPI = {
  staff: [
    {
      id: 1,
      first_name: "Анна",
      second_name: "Стилист",
      specialization: "Парикмахер-стилист",
      birth_date: "1993-05-14",
      phone_number: "+375 (29) 111-22-33"
    },
    {
      id: 2,
      first_name: "Дарья",
      second_name: "Ноготок",
      specialization: "Мастер маникюра",
      birth_date: "1997-09-21",
      phone_number: "+375 (29) 222-33-44"
    },
    {
      id: 3,
      first_name: "Елена",
      second_name: "Брови",
      specialization: "Бровист-визажист",
      birth_date: "1995-12-05",
      phone_number: "+375 (29) 333-44-55"
    },
    {
      id: 4,
      first_name: "Иван",
      second_name: "Массаж",
      specialization: "Массажист",
      birth_date: "1990-03-18",
      phone_number: "+375 (29) 444-55-66"
    },
    {
      id: 5,
      first_name: "Ольга",
      second_name: "Космет",
      specialization: "Косметолог",
      birth_date: "1988-07-25",
      phone_number: "+375 (29) 555-66-77"
    },
    {
      id: 6,
      first_name: "Марина",
      second_name: "Главная",
      specialization: "Управление и администрирование",
      birth_date: "1985-02-10",
      phone_number: "+375 (29) 777-88-99"
    }
  ],

  // СУЩНОСТЬ АККАУНТОВ С ВНЕШНИМ КЛЮЧОМ staff_id
  accounts: [
    { id: 1, email: "anna.stylist@salon.by", password: "hashed_password_123", staff_id: 1 },
    { id: 2, email: "daria.nails@salon.by", password: "hashed_password_456", staff_id: 2 },
    { id: 3, email: "elena.brows@salon.by", password: "hashed_password_789", staff_id: 3 },
    { id: 4, email: "ivan.massage@salon.by", password: "hashed_password_abc", staff_id: 4 },
    { id: 5, email: "olga.cosmet@salon.by", password: "hashed_password_def", staff_id: 5 },
    { id: 6, email: "marina.manager@salon.by", password: "hashed_password_root", staff_id: 6 }
  ],

  all: function () {
    return this.staff;
  },

  get: function (id) {
    const isEmployee = (p) => p.id === id;
    return this.staff.find(isEmployee);
  },

  delete: function (id) {
    const isNotDelEmployee = (p) => p.id !== id;
    this.staff = this.staff.filter(isNotDelEmployee);
    // Каскадное удаление аккаунта при удалении сотрудника
    this.accounts = this.accounts.filter(acc => acc.staff_id !== id);
    return true;
  },

  add: function (employee) {
    if (!employee.id) {
      const maxId = this.staff.reduce((prev, current) => {
        return prev.id > current.id ? prev : current;
      }, { id: 0 }).id;
      
      employee = { ...employee, id: maxId + 1 };
    }
    this.staff = [...this.staff, employee];
    return employee;
  },

  update: function (employee) {
    this.staff = this.staff.map((item) => 
      item.id === employee.id ? { ...item, ...employee } : item
    );
    return employee;
  },

  // МЕТОД ДЛЯ ПОЛУЧЕНИЯ АККАУНТА КОНКРЕТНОГО СОТРУДНИКА
  getAccountByStaffId: function (staffId) {
    return this.accounts.find(acc => acc.staff_id === staffId) || null;
  }
};

// ==========================================
// КОД СЕРВЕРА НА ЧИСТОМ NODE.JS (БЕЗ EXPRESS)
// ==========================================
const PORT = 5000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. GET /api/staff — Отдаем список сотрудников фронтенду
  if (req.method === 'GET' && req.url === '/api/staff') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(BeautySalonAPI.all()));
    return;
  }

  // NEW: 2. GET /api/accounts — Технический роут для просмотра всех аккаунтов
  if (req.method === 'GET' && req.url === '/api/accounts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(BeautySalonAPI.accounts));
    return;
  }

  // 3. POST /api/staff — Добавление нового сотрудника
  if (req.method === 'POST' && req.url === '/api/staff') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const employeeData = JSON.parse(body);
        const newEmployee = BeautySalonAPI.add(employeeData);
        
        // Автоматически генерируем аккаунт для созданного сотрудника
        const maxAccId = BeautySalonAPI.accounts.reduce((max, acc) => acc.id > max ? acc.id : max, 0);
        BeautySalonAPI.accounts.push({
          id: maxAccId + 1,
          email: `${newEmployee.first_name.toLowerCase()}@salon.by`,
          password: "temporary_password_123",
          staff_id: newEmployee.id
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newEmployee));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Некорректный JSON' }));
      }
    });
    return;
  }

  // 4. DELETE /api/staff/:id — Удаление сотрудника по ID
  if (req.method === 'DELETE' && req.url.startsWith('/api/staff/')) {
    const idParam = req.url.split('/').pop();
    const numericId = Number(idParam);

    BeautySalonAPI.delete(numericId);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Сотрудник и его аккаунт удалены' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        
        // Ищем аккаунт по email и паролю в нашей базе BeautySalonAPI.accounts
        const account = BeautySalonAPI.accounts.find(
          acc => acc.email === email && acc.password === password
        );

        if (account) {
          // Если нашли — возвращаем успех и email
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: "Успешный вход", email: account.email }));
        } else {
          // Если не нашли — возвращаем ошибку 401 (Unauthorized)
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Неверный Email или Password" }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Некорректный JSON запроса' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Маршрут не найден' }));
});

server.listen(PORT, () => {
  console.log(`Бэкенд-сервер на чистом Node.js успешно запущен на http://localhost:${PORT}`);
});

export default BeautySalonAPI;
