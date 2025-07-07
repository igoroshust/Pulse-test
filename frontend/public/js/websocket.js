//const socket = new WebSocket('ws://localhost:8080/ws/information_updates/');
//
//socket.onopen = function() {
//    console.log('Соединение установлено');
//    socket.send(JSON.stringify({ action: 'get_data' }));  // Отправляем запрос на получение данных
//};
//
//socket.onmessage = function(event) {
//    const data = JSON.parse(event.data);
//    console.log('Полученные данные:', data);
//
//    const tableBody = document.querySelector('#datatablesSimple tbody');
//    tableBody.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных
//
//    let totalActiveWindows = 0; // Переменная для хранения суммы active_windows
//    let totalFactActiveWindows = 0; // Переменная для хранения суммы fact_active_windows
//
//    data.data.forEach(item => {
//        const row = document.createElement('tr');
//        row.innerHTML = `
//            <td class="branch-name">${item.filial}</td>
//            <td>${item.active_windows}</td>
//            <td>${item.fact_active_windows}</td>
//            <td>${item.inactive_windows}</td>
//            <td>${item.deep_recording}</td>
//            <td>${item.average_time_waiting}</td>
//        `;
//        tableBody.appendChild(row);
//
//        // Суммируем значения
//        totalActiveWindows += item.active_windows;
//        totalFactActiveWindows += item.fact_active_windows;
//    });
//
//    // Обновляем значения в карточках
//    document.querySelector('#activeWindowsCard a').textContent = totalActiveWindows;
//    document.querySelector('#activeSessionsCard a').textContent = totalFactActiveWindows;
//
//    // Привязываем обработчики событий к новым ячейкам
//    attachBranchClickHandlers();
//};
//
//socket.onerror = function(error) {
//    console.error('Ошибка WebSocket:', error);
//};
//
//socket.onclose = function(event) {
//    console.log('Соединение закрыто', event);
//};
//
//// Функция для привязки обработчиков событий к ячейкам с классом branch-name
//function attachBranchClickHandlers() {
//    const branchCells = document.querySelectorAll('.branch-name');
//    branchCells.forEach(cell => {
//        cell.addEventListener('click', function() {
//            const branchName = this.textContent; // Получаем имя филиала
//            console.log('Выбран филиал:', branchName); // Для отладки
//
//            // Открываем модальное окно
//            const modal = new bootstrap.Modal(document.getElementById('dataModal-1'));
//            modal.show();
//        });
//    });
//}