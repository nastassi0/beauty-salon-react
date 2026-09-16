const BeautySalonAPI = {
  staff: [
    { id: 1, name: "Анна Стилист", job: "Парикмахер-стилист" },
    { id: 2, name: "Дарья Ноготок", job: "Мастер маникюра" },
    { id: 3, name: "Елена Брови", job: "Бровист-визажист" },
    { id: 4, name: "Иван Массаж", job: "Массажист" },
    { id: 5, name: "Ольга Космет", job: "Косметолог" },
    { id: 6, name: "Марина Главная", job: "Управляющий" },
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
};

export default BeautySalonAPI;
