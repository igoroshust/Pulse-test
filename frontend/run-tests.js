const { exec } = require('child_process');

// Функция для запуска команды
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при выполнении команды: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Ошибка: ${stderr}`);
        return reject(stderr);
      }
      console.log(`Результаты выполнения команды:\n${stdout}`);
      resolve(stdout);
    });
  });
};

// Команды для запуска
const command1 = "npx cypress run --spec 'cypress/e2e/fill-eo-live.spec.js' --env USERNAME=AutomationTesting,PASSWORD=mfc-0202testing";
const command2 = "npx cypress run --spec 'cypress/e2e/fill-eo-live.spec.js' --env USERNAME=AutomationTesting1,PASSWORD=R9b2f10nn";
const command3 = "npx cypress run --spec 'cypress/e2e/fill-eo-live.spec.js' --env USERNAME=AutomationTesting2,PASSWORD=Mfi5566P";

// Запуск команд асинхронно
Promise.all([runCommand(command1), runCommand(command2), runCommand(command3)])
  .then(results => {
    console.log('Все команды завершены.');
  })
  .catch(error => {
    console.error('Произошла ошибка при выполнении команд:', error);
  });