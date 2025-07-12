<script>
    const socket = new WebSocket('ws://localhost:5050/ws/information_updates/');

    socket.onopen = function() {
        console.log('Соединение установлено! (Main)');
        socket.send(JSON.stringify({ action: 'get_data' }));  // Отправляем запрос на получение данных
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Полученные данные:', data);

        const tableBody = document.querySelector('#datatablesSimple tbody');

        let totalActiveWindows = 0; // Переменная для хранения суммы active_windows
        let totalFactActiveWindows = 0; // Переменная для хранения суммы fact_active_windows
        let totalDifferenceInMinutes = 0; // Переменная для хранения суммы difference_in_minutes

        data.data.forEach(item => {
            // Проверяем, существует ли уже строка с таким филиалом
            let existingRow = Array.from(tableBody.rows).find(row => row.cells[0].textContent === item.filial);

            if (existingRow) {
                // Обновляем существующую строку
                existingRow.cells[1].textContent = item.filial_name;
                existingRow.cells[2].textContent = item.active_windows_count;
                existingRow.cells[3].textContent = item.fact_active_windows_count;
                existingRow.cells[4].textContent = item.inactive_windows;
                existingRow.cells[5].textContent = item.deep_recording;
                existingRow.cells[6].textContent = item.difference_in_minutes;
            } else {
                // Если строки нет, добавляем новую
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="branch-name">${item.filial_name}</td>
                    <td>${item.active_windows_count}</td>
                    <td>${item.fact_active_windows_count}</td>
                    <td>${item.inactive_windows}</td>
                    <td>${item.deep_recording}</td>
                    <td>${item.difference_in_minutes} минут</td>
                `;
                tableBody.appendChild(row);
            }

            // Суммируем значения
            totalActiveWindows += item.active_windows_count;
            totalFactActiveWindows += item.fact_active_windows_count;
            totalDifferenceInMinutes += item.difference_in_minutes;

        });

        // Обновляем значения в карточках
        document.querySelector('#activeWindowsCard a').textContent = totalActiveWindows;
        document.querySelector('#activeSessionsCard a').textContent = totalFactActiveWindows;
        document.querySelector('#differenceInMinutes a').textContent = totalDifferenceInMinutes + ' минут';


        // Привязываем обработчики событий к новым ячейкам
        attachBranchClickHandlers();
    };

    socket.onerror = function(error) {
        console.error('Ошибка WebSocket:', error);
    };

    socket.onclose = function(event) {
        console.log('Соединение закрыто', event);
    };

    // Функция для привязки обработчиков событий к ячейкам с классом branch-name
    let selectedFilial = '';

    function attachBranchClickHandlers() {
        const filialCells = document.querySelectorAll('.branch-name');
        filialCells.forEach(cell => {
            cell.addEventListener('click', function() {
                selectedFilial = this.textContent; // Получаем имя филиала
                console.log('Выбран филиал:', selectedFilial); // Для отладки

                // Открываем модальное окно
                const modal = new bootstrap.Modal(document.getElementById('dataModal-1'));
                modal.show();
            });
        });
    }
</script>



    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const datePicker = document.getElementById('datePicker');
            const rangeSelect = document.getElementById('rangeSelect');
            const applyButton = document.getElementById('applyButton');
            const modalTableBody = document.getElementById('modalTableBody');


            // Обработчик клика для карточки "Активные окна"
            document.getElementById('activeWindowsCard').addEventListener('click', function() {
                openModal([
                    { window: 1, operator: 'Холмогорова', filial: 'МФЦ “Кыра”', status: 'Нет на месте' },
                    { window: 2, operator: 'Патрина', filial: 'МФЦ “Газ-Завод”', status: 'Обслуживает' }
                ]);
            });

            // Обработчик клика для карточки "Действующие окна"
            document.getElementById('activeSessionsCard').addEventListener('click', function() {
                openModal([
                    { window: 1, operator: 'Холмогорова', filial: 'МФЦ “Кыра”', status: 'Обслуживает' },
                    { window: 2, operator: 'Патрина', filial: 'МФЦ “Газ-Завод”', status: 'Обслуживает' }
                ]);
            });

            // Функция для открытия модального окна и заполнения данными
            function openModal(data) {
                modalTableBody.innerHTML = ''; // Очищаем предыдущие данные
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.window_number}</td>  <!-- Изменено на window_number -->
                        <td>${item.operator}</td>
                        <td>${item.filial}</td>
                        <td>${item.status}</td>
                    `;
                    modalTableBody.appendChild(row);
                });
                // Показываем модальное окно
                const modal = new bootstrap.Modal(document.getElementById('dataModal'));
                modal.show();
            }

            // Обработчик изменения для выбора даты и диапазона
            datePicker.addEventListener('change', checkButtonState);
            rangeSelect.addEventListener('change', checkButtonState);

            function checkButtonState() {
                if (datePicker.value && rangeSelect.value) {
                    applyButton.disabled = false;
                } else {
                    applyButton.disabled = true;
                }
            }

            // Обработчик клика на кнопку "Применить"
            applyButton.addEventListener('click', function() {
                const selectedDate = datePicker.value;
                const selectedRange = rangeSelect.value;

                console.log(selectedFilial);
                console.log(selectedDate);
                console.log(selectedRange);

                // Отправляем данные на сервер
                socket.send(JSON.stringify({
                    action: 'apply',
                    filial: selectedFilial,
                    date: selectedDate,
                    range: selectedRange
                }));

                // Закрываем модальное окно
                const modal = bootstrap.Modal.getInstance(document.getElementById('dataModal-1'));
                modal.hide();

                // Сохраняем данные в localStorage
                localStorage.setItem('filial', selectedFilial);
                localStorage.setItem('date', selectedDate);
                localStorage.setItem('range', selectedRange);

                // Перенаправляем на about-page
                window.location.href = 'about-page.html';
            });
        });
    </script>