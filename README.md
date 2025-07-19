### Настройка бэкенда

1. Установить Python (https://www.python.org/downloads/);
2. Скачать проект с Github
3. Открыть проект в IDE (Pulse-test)
4. Выполнить команды в консоле:
- `python -m venv venv`
- `venv\scripts\activate`
- `pip install -r requirements.txt`
- `cd backend`
- `python manage.py runserver` (запуск сервера)

### Настройка WebSocket на сервере
1. Открыть консоль (cmd/powershell)
2. Перейти по пути расположения проекта (Pulse-test)
3. Выполнить команды:
- `venv\scripts\activate`
- `cd backend`
- `set DJANGO_SETTINGS_MODULE=backend.settings`
- `daphne -p 5050 backend.asgi:application` (-p <порт> можно поменять на любой свободный)

### Настройка фронтенда

1. Открыть новую вкладку терминала в IDE (сервер должен быть запущен!)
2. Вернуться на уровень Pulse-test (если находимся в Pulse-test>backend, то нужно `cd ..`)
3. Выполнить команды:
- `cd frontend`
- `npm i` (установка зависимостей)

Для запуска фронтенда в режиме Development:
- `npm start`
- Переходим на клиент по ссылке из консоли (пример: http://localhost:3000)


Для запуска в режиме Production:
- `npm install -g serve`
- `npm run build`
- `serve -s build`
- Переходим на клиент по ссылке из консоли

### Настройка WebSocket на клиенте
1. Установить Redis (не ниже 7 версии!). [Скачать Redis](https://github.com/redis-windows/redis-windows/releases)
2. Запустить `redis_server.exe` в режиме администратора

### Запуск тестов (из BASE_DIR)

#### асинхронное создание талонов
- `cd frontend`
- `node run-tests.js`

#### cypress
- `cd frontend`
- `npx cypress open`