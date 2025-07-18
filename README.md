### Настройка бэкенда

1. Установить Python (https://www.python.org/downloads/);
2. Скачать проект с Github
3. Открыть проект в IDE (Pulse-test)
4. Выполнить команды в консоле:
5. python -m venv venv
6. venv\scripts\activate
7. pip install -r requirements.txt
7. cd backend
8. python manage.py runserver (запуск сервера)

### Настройка WS на сервере
1. Открыть консоль (cmd/powershell)
2. Перейти по пути расположения проекта (Pulse-test)
3. venv\scripts\activate
4. cd backend
5. set DJANGO_SETTINGS_MODULE=backend.settings
6. daphne -p 5050 backend.asgi:application (порт можно поменять на другой)

### Настройка фронтенда

1. Открыть новую вкладку терминала (сервер должен быть запущен!)
2. Вернуться на уровень Pulse-test (если находимся в Pulse-test>backend, то нужно cd ..)
3. cd frontend
4. npm i

- Запуск в режиме Development (видны ошибки react-scripts):
  1) npm start
  2) Перейти по ссылке из консоли (пример: http://localhost:3000)


- Запуск в режиме Production:
  1) npm install -g serve
  2) npm run build
  3) serve -s build
  4) Перейти по ссылке из консоли (пример: http://localhost:3000)

### Настройка WS на клиенте
1. Установить Redis: https://github.com/redis-windows/redis-windows/releases
2. Запустить redis_server.exe

### Запуск тестов 

#### асинхронное создание талонов

1. cd frontend
2. node run-tests.js

#### cypress
1. npx cypress open