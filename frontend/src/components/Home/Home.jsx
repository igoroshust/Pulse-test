import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';

import Footer from './../Footer/Footer';

import Block from './../Block/Block';
import ActiveWindowsBlock from './../Block/ActiveWindowsBlock/ActiveWindowsBlock';
import DeepRecordingBlock from './../Block/DeepRecordingBlock/DeepRecordingBlock';
import FactActiveWindowsBlock from './../Block/FactActiveWindowsBlock/FactActiveWindowsBlock';
import DelayByWindowsBlock from './../Block/DelayByWindowsBlock/DelayByWindowsBlock';

import Modal from './../Modal/Modal';

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState('');
  const [socket, setSocket] = useState(null);
  const [dataTable, setDataTable] = useState(null); // Храним экземпляр DataTable

  const [totalActiveWindows, setTotalActiveWindows] = useState(0); // Общее количество активных окон
  const [totalFactActiveWindows, setTotalFactActiveWindows] = useState(0); // Общее количество действующий окон
  const [totalDelayByWindows, setTotalDelayByWindows] = useState(0); // Общее количество окон в простое

  const [timer, setTimer] = useState('');
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    // Устанавливаем WebSocket соединение
    const newSocket = new WebSocket('ws://localhost:5050/ws/information_updates/');
    setSocket(newSocket);

    newSocket.onopen = function() {
      console.log('Соединение установлено! (Main)');
      newSocket.send(JSON.stringify({ action: 'get_data' })); // Отправляем запрос на получение данных
    };

    newSocket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log('Полученные данные:', data);

      // Обработка данных
      if (data.action === 'get_active_windows' ||
            data.action === 'get_fact_active_windows' ||
           data.action === 'get_delay_by_windows' ||
           data.action === 'get_active_windows_by_filial' ||
           data.action === 'get_fact_active_windows_by_filial' ||
           data.action === 'get_delay_by_windows_by_filial') {
        openModal(data.data);
        return;
      } else if (data.action === 'get_deep_recording' ||
          data.action === 'get_deep_recording_by_filial') {
        openModal_deepRecording(data.data);
        return;
      } else if (data.action === 'get_avg_time_by_filial') {
          openModal_avgTime(data.data);
          return;
      }

      // Обновляем данные для таблицы
      setData(data.data);

      // Сброс значений перед подсчетом
      let activeWindowsSum = 0;
      let factActiveWindowsSum = 0;
      let delayByWindowsSum = 0;

      data.data.forEach(item => {
        activeWindowsSum += item.active_windows_count;
        factActiveWindowsSum += item.fact_active_windows_count;
        delayByWindowsSum += item.delay_by_windows;
      });

      // Обновляем состояние для счётчиков в блоках
      setTotalActiveWindows(activeWindowsSum);
      setTotalFactActiveWindows(factActiveWindowsSum);
      setTotalDelayByWindows(delayByWindowsSum);

    };

    newSocket.onerror = function(error) {
      console.error('Ошибка WebSocket:', error);
    };

    newSocket.onclose = function(event) {
      console.log('Соединение закрыто', event);
    };

    // Очистка WebSocket при размонтировании компонента
    return () => {
      newSocket.close();
    };
  }, []); // Пустой массив зависимостей, чтобы выполнить эффект только один раз при монтировании

  useEffect(() => {
    // Функция для обновления таймера
    const updateTimer = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}:${seconds}`;
      setTimer(currentTime); // Обновляем состояние таймера
    };
    // Устанавливаем начальное значение таймера
    updateTimer();
    // Обновляем таймер каждую секунду
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId); // Очищаем интервал при размонтировании компонента
  }, []); // Пустой массив зависимостей, чтобы выполнить эффект только один раз при монтировании

  useEffect(() => {
  if (dataTable) {
    dataTable.destroy(); // Уничтожаем предыдущую таблицу, если она существует
  }

  const tableBody = document.getElementById('datatablesSimple').querySelector('tbody');
  tableBody.innerHTML = ''; // Очищаем предыдущие данные

  // Массив с информацией о ячейках и соответствующих действиях
  const cellActions = [
    { className: 'filial-active-windows-count', action: 'get_active_windows_by_filial' },
    { className: 'filial-fact-active-windows-count', action: 'get_fact_active_windows_by_filial' },
    { className: 'filial-delay-by-windows', action: 'get_delay_by_windows_by_filial' },
    { className: 'filial-deep-recording', action: 'get_deep_recording_by_filial' },
    { className: 'filial-avg-time', action: 'get_avg_time_by_filial' },
  ];


  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="filial-name">${item.filial_name}</td>
      <td class="filial-active-windows-count">${item.active_windows_count}</td>
      <td class="filial-fact-active-windows-count">${item.fact_active_windows_count}</td>
      <td class="filial-delay-by-windows">${item.delay_by_windows}</td>
      <td class="filial-deep-recording">${item.deep_recording + ' человек(-а)' || 'Неизвестно'}</td>
      <td class="filial-avg-time">${Math.ceil(item.avg_time)} мин.</td>
    `;
    tableBody.appendChild(row);

    // Добавляем обработчики кликов для каждой ячейки
    cellActions.forEach(({ className, action }) => {
      const cell = row.querySelector(`.${className}`);
      cell.addEventListener('click', function() {
        const filialName = this.closest('tr').cells[0].textContent; // Получаем имя филиала
        socket.send(JSON.stringify({ action, filial: filialName }));
      });
    });
  });

  const table = new DataTable('#datatablesSimple', {
    data: {
      headings: [
        'Филиал',
        'Активные окна',
        'Действующие окна',
        'Простой по окнам',
        'Глубина записи по талонам',
        'Среднее время ожидания',
      ]
    },
  });

  setDataTable(table); // Сохраняем экземпляр DataTable
  return () => {
    table.destroy(); // Уничтожаем таблицу при размонтировании компонента
  };
}, [data]); // Запускаем эффект при изменении данных


  // Функция для открытия модального окна и заполнения данными
  const openModal = (data) => {
    const modalTableBody = document.getElementById('modalTableBody');
    modalTableBody.innerHTML = ''; // Очищаем предыдущие данные

    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.window_number}</td>
        <td>${item.fio || 'Неизвестно'}</td>
        <td>${item.filial_name}</td>
        <td>${Math.ceil(item.working_minutes) + ' мин.' || 'Неизвестно'}</td>
      `;
      modalTableBody.appendChild(row);
    });

    // Показываем модальное окно
    const modal = new window.bootstrap.Modal(document.getElementById('dataModal'));
    modal.show();
  };

  // Функция для открытия модального окна (ГЛУБИНА ЗАПИСИ)
    const openModal_deepRecording = (data) => {
        const modalDeepRecordingTableBody = document.getElementById('modalDeepRecordingTableBody');
        modalDeepRecordingTableBody.innerHTML = ''; // Очищаем предыдущие данные

        data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.filial_name}</td>
                    <td>${item.total_talons}</td>
                    <td>${item.waiting_talons}</td>
                    <td>${item.not_accepted_talons}</td>
                `;
                modalDeepRecordingTableBody.appendChild(row);
        });

        // Показываем модальное окно
        const modal = new window.bootstrap.Modal(document.getElementById('dataModal-deepRecordingTable'));
        modal.show();
    }

     // Функция для открытия модального окна (Среднее время ожидания)
    const openModal_avgTime = (data) => {
        const modalAvgTimeTableBody = document.getElementById('modalAvgTimeTableBody');
        modalAvgTimeTableBody.innerHTML = ''; // Очищаем предыдущие данные

        data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.talon_name}</td>
                    <td>${item.fio}</td>
                    <td>${item.current_time} мин.</td>
                `;
                modalAvgTimeTableBody.appendChild(row);
        });

        // Показываем модальное окно
        const modal = new window.bootstrap.Modal(document.getElementById('dataModal-avgTimeTable'));
        modal.show();
    }

  // Обработчик клика для карточки "Активные окна"
  const handleActiveWindowsClick = () => {
    socket.send(JSON.stringify({ action: 'get_active_windows' }));
  };

  // Обработчик клика для карточки "Действующие окна"
  const handleFactActiveWindowsClick = () => {
    socket.send(JSON.stringify({ action: 'get_fact_active_windows' }));
  };

  // Обработчик клика для карточки "Простой по окнам"
  const handleDelayByWindowsClick = () => {
    socket.send(JSON.stringify({ action: 'get_delay_by_windows' }));
  };

    // Обработчик клика для карточки "Простой по окнам"
  const handleDeepRecordingClick = () => {
    socket.send(JSON.stringify({ action: 'get_deep_recording' }));
  };


  return (
    <div>
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">МФЦ Забайкальского края</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Статистика</li>
              </ol>
              <div className="row">

                <DeepRecordingBlock onClick={handleDeepRecordingClick} />

                <ActiveWindowsBlock totalActiveWindows={totalActiveWindows} onClick={handleActiveWindowsClick}/>

                <FactActiveWindowsBlock totalFactActiveWindows={totalFactActiveWindows} onClick={handleFactActiveWindowsClick} />

                <DelayByWindowsBlock totalDelayByWindows={totalDelayByWindows} onClick={handleDelayByWindowsClick} />

              </div>


              <div className="card mb-4">
                <div className="card-header">
                  <div><i className="fas fa-table me-1"></i> Информация по филиалам</div>
                  <div id="timer">{timer}</div>
                </div>
                <div className="card-body">
                  <table id="datatablesSimple">
                    <thead>
                      <tr>
                        <th>Филиал</th>
                        <th>Активные окна</th>
                        <th>Действующие окна</th>
                        <th>Простой по окнам</th>
                        <th>Глубина записи по талонам</th>
                        <th>Среднее время ожидания</th>
                      </tr>
                    </thead>
                    <tbody>
                        {/* Добавляем данные через JS */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>

          <Footer />

        </div>
      </div>

      {/* Модальное окно для отображения данных */}
      <div className="modal fade" id="dataModal" tabIndex="-1" aria-labelledby="dataModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="dataModalLabel">Данные</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Окно</th>
                    <th>Оператор</th>
                    <th>Филиал</th>
                    <th>Время</th>
                  </tr>
                </thead>
                <tbody id="modalTableBody">
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
          </div>
        </div>
      </div>

      {/*  Модальное окно для глубины записи по талонам (таблица) */}
        <div className="modal fade" id="dataModal-deepRecordingTable" tabIndex="-1" aria-labelledby="dataModal-deepRecordingTable-Label" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="dataModal-deepRecordingTable-Label">Данные</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Филиал</th>
                                    <th>Обслужено</th>
                                    <th>В очереди</th>
                                    <th>Сброшено</th>
                                </tr>
                            </thead>
                            <tbody id="modalDeepRecordingTableBody">
                                {/* Добавляем данные через JS */}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

    {/*  Модальное окно для среднего времени ожидания (таблица) */}
    <div className="modal fade" id="dataModal-avgTimeTable" tabindex="-1" aria-labelledby="dataModal-avgTimeTable-Label" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="dataModal-avgTimeTable-Label">Данные</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Талон</th>
                                <th>Заявитель</th>
                                <th>Текущее время ожидания</th>
                            </tr>
                        </thead>
                        <tbody id="modalAvgTimeTableBody">
                            {/* Добавляем данные через JS */}
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>

    </div>
  );
}

export default Home;