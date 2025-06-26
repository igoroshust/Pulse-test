// Функция для генерации случайного имени
function getRandomName() {
  const firstNames = ['Александр', 'Дмитрий', 'Сергей', 'Иван', 'Павел'];
  const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Смирнов'];
  const middleName = 'Тестович';
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${lastName} ${firstName} ${middleName}`;
}

// Функция для генерации случайного номера телефона
function getRandomPhone() {
  let phone = '9'; // Начинаем с 9 для мобильного номера
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10); // Добавляем случайные цифры от 0 до 9
  }
  return phone;
}

// Функция для генерации случайного email
function getRandomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomString = () => {
    return Array.from({ length: 2 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };
  return `${randomString()}@${randomString()}.${randomString()}`;
}

let executionCount = 0; // Переменная для отслеживания количества запусков
let windowsCount = 23; // окна 25-31
const maxExecutions = 6; // Максимальное количество запусков

Cypress.Commands.add('runTest', () => {
  // Переход на страницу входа в пульт
  cy.visit('https://mfc-eq.loc/pult/login');

  // Вводим учетные данные в пульте
  cy.get('input[name="login"]').type('AutomationTesting');
  cy.get('input[name="password"]').type('mfc-0202testing');
  cy.get('.btn.btn-primary').click();

  // Выбор офиса обслуживания
  cy.wait(2000);
  cy.get('.select2-chosen').click();
  cy.get('.select2-result-label').click();
  cy.get('.btn.btn-primary').click();

  // Выбор окна обслуживания
  cy.wait(2000);
  cy.get('.select2-chosen').click();
  cy.get('.select2-result-label').eq(windowsCount).click(); // выбираем первое окно
  cy.get('.btn.btn-primary').click();

  // Переход на страницу входа в АРМ (администрирование)
  cy.wait(2000);
  cy.visit('https://mfc-eq.loc/arm/login');

  // Вводим учетные данные
  cy.wait(2000);
  cy.get('input[name="login"]').type('AutomationTesting');
  cy.get('input[name="password"]').type('mfc-0202testing');
  cy.get('.btn.btn-primary').click();

  // Выбор офиса обслуживания
  cy.wait(2000);
  cy.get('.select2-chosen').click();
  cy.get('.select2-result-label').click();
  cy.get('.btn.btn-primary').click();

  // Переход во вкладку "Живая запись"
  cy.wait(2000);
  cy.get('a[title="Живая запись"]').click({ force: true });
  cy.get('.btn.btn-success').click();

  // Выбор услуги
  cy.wait(2000);
  cy.get('.service-group.ng-scope').eq(0).click({ force: true });
  cy.wait(1000);
  cy.get('.ng-binding').eq(17).click({ force: true });
  cy.wait(1000);
  cy.get('.btn.btn-primary').eq(5).click({ force: true });

  // Выбранные услуги
  cy.wait(2000);
  cy.get('.btn.btn-primary').eq(3).click();

  // Основная информация
  cy.wait(2000);
  cy.get('form input[name="talonFio"]').type(getRandomName());
  cy.wait(1000);
  cy.get('form input[name="talonPhone"]').type(getRandomPhone());
  cy.get('form input[name="talonEmail"]').type(getRandomEmail());
  cy.get('paper-checkbox[name="printCheck"]').click();
  cy.get('.btn.btn-primary').eq(5).click();
  cy.wait(1000);
  cy.get('.btn.btn-success.ng-scope').click(); // Регистрация талона

  // Аннулирование
//  cy.wait(1000);
//  cy.get('.btn.btn-danger').eq(0).click();
//  cy.wait(3000);
//  cy.get('.btn.btn-primary.confirm-action.affirmative.ng-binding').click();

//  // Сброс окна в разделе "Статистика"
//  cy.get('a[title="Статистика"]').click({ force: true });
//  cy.wait(2000);
////  cy.get('.x-scope.paper-tab-0.iron-selected').click(); // Переход во вкладку "Окна"
//  cy.get('.tab-content.style-scope.paper-tab').eq(1).click({ force: true }); // Переход во вкладку "Окна"
//  cy.wait(2000);
//  cy.get('.ion-close').click(); // Деактивировать окно

  // Увеличиваем счетчик исполнений
  executionCount++;
  windowsCount++;

  // Проверяем, достигли ли мы максимального количества запусков
//  if (executionCount < maxExecutions) {
//    // Запускаем тест снова через 20 секунд
//    cy.wait(5000).then(() => {
//      cy.runTest(); // Повторный запуск теста
//    });
//  }
});

describe('Заполнение формы на стороннем сервисе', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // Игнорировать ошибки
    });
  });

  it('должен авторизоваться через интерфейс и заполнить данные в форме', () => {
    cy.runTest(); // Запускаем тест
  });
});


// "test": "react-scripts test"
// npx cypress run --spec 'cypress/e2e/fill-eo-live.spec.js' --env USERNAME=AutomationTesting,PASSWORD=mfc-0202testing