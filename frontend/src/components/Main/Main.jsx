import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';
import { defaultConfig } from './../../config/config.ts';

import Footer from './../Footer/Footer';
import ActiveWindowsBlock from './../Block/ActiveWindowsBlock/ActiveWindowsBlock';
import DeepRecordingBlock from './../Block/DeepRecordingBlock/DeepRecordingBlock';
import FactActiveWindowsBlock from './../Block/FactActiveWindowsBlock/FactActiveWindowsBlock';
import DelayByWindowsBlock from './../Block/DelayByWindowsBlock/DelayByWindowsBlock';

import ActiveWindowsBlockModal from './../Modal/ActiveWindowsBlockModal/ActiveWindowsBlockModal';
import DeepRecordingBlockModal from './../Modal/DeepRecordingBlockModal/DeepRecordingBlockModal';
import AvgTimeModal from './../Modal/AvgTimeModal/AvgTimeModal';

const Main = () => {
  const [data, setData] = useState([]); // Данные с бэкенда
  const [timer, setTimer] = useState(''); // Таймер в таблице
  const [socket, setSocket] = useState(null);  // WS-соединение
  const [dataTable, setDataTable] = useState(null); // Таблица

  const [totalActiveWindows, setTotalActiveWindows] = useState(0); // Все активные окна
  const [totalFactActiveWindows, setTotalFactActiveWindows] = useState(0); // Все действующие окна
  const [totalDelayByWindows, setTotalDelayByWindows] = useState(0); // Все простаивающие окна

  const [modalData, setModalData] = useState([]); // Модальное окно
  const [activeModal, setActiveModal] = useState(null); // Для управления открытием модальных окон

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5050/ws/information_updates/');
    setSocket(newSocket);

    newSocket.onopen = function() {
      console.log('Соединение установлено! (Main)');
      newSocket.send(JSON.stringify({ action: 'get_data' }));
    };

    newSocket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log('Полученные данные:', data);

      // Отображение содержимого модалки исходя их контекста
      switch (data.action) {
            case 'get_active_windows':
            case 'get_fact_active_windows':
            case 'get_delay_by_windows':
            case 'get_active_windows_by_filial':
            case 'get_fact_active_windows_by_filial':
            case 'get_delay_by_windows_by_filial':
                openModal(data.data, 'active');
                return;

            case 'get_deep_recording':
            case 'get_deep_recording_by_filial':
                openModal(data.data, 'deep');
                return;

            case 'get_avg_time_by_filial':
               openModal(data.data, 'avg');
               return;
      };

      // Обновляем состояние полученных данных
      setData(data.data);

      let activeWindowsSum = 0; // Общее количество активных окон
      let factActiveWindowsSum = 0; // Общее количество действующих окон
      let delayByWindowsSum = 0; // Общее количество простоя по окнам

      data.data.forEach(item => {
        activeWindowsSum += item.active_windows_count;
        factActiveWindowsSum += item.fact_active_windows_count;
        delayByWindowsSum += item.delay_by_windows;
      });

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

    return () => {
      newSocket.close();
    };
  }, []);

  // Таймер в таблице
  useEffect(() => {
    const updateTimer = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;
        setTimer(currentTime); // Обновляем состояние таймера
    };
    // Устанавливаем новое значение таймера
    updateTimer();

    // Обновляем таймер каждую секунду
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []); // Пустой массив зависимостей для выполнения эффекта единожды при монтировании

  useEffect(() => {
  // Создаём таблицу "Информация по филиалам"
  if (dataTable) {
    dataTable.destroy();
  }

  const tableBody = document.getElementById('datatablesSimple').querySelector('tbody');
  tableBody.innerHTML = '';

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
  });

  const table = new DataTable('#datatablesSimple', {
    ...defaultConfig,
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

  // Добавляем делегированный обработчик событий на tbody
  tableBody.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('filial-active-windows-count')) {
        const filialName = target.closest('tr').querySelector('.filial-name').textContent;
        socket.send(JSON.stringify({ action: 'get_active_windows_by_filial', filial: filialName }));

      } else if (target.classList.contains('filial-fact-active-windows-count')) {
          const filialName = target.closest('tr').querySelector('.filial-name').textContent;
          socket.send(JSON.stringify({ action: 'get_fact_active_windows_by_filial', filial: filialName }));

      } else if (target.classList.contains('filial-delay-by-windows')) {
          const filialName = target.closest('tr').querySelector('.filial-name').textContent;
          socket.send(JSON.stringify({ action: 'get_delay_by_windows_by_filial', filial: filialName }));

      } else if (target.classList.contains('filial-deep-recording')) {
          const filialName = target.closest('tr').querySelector('.filial-name').textContent;
          socket.send(JSON.stringify({ action: 'get_deep_recording_by_filial', filial: filialName }));

      } else if (target.classList.contains('filial-avg-time')) {
          const filialName = target.closest('tr').querySelector('.filial-name').textContent;
          socket.send(JSON.stringify({ action: 'get_avg_time_by_filial', filial: filialName }));
      }

  });

  setDataTable(table);
  return () => {
    table.destroy();
  };
}, [data]);


  const openModal = (data, type) => {
    setModalData(data);
    setActiveModal(type); // Устанавливаем тип модального окна
  };

  const closeModal = () => {
    setActiveModal(null); // Закрываем модальное окно
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

                {/* Глубина записи по талонам */}
                <DeepRecordingBlock onClick={() => socket.send(JSON.stringify({ action: 'get_deep_recording' }))} />

                {/* Активные окна */}
                <ActiveWindowsBlock totalActiveWindows={totalActiveWindows} onClick={() => socket.send(JSON.stringify({ action: 'get_active_windows' }))} />

                {/* Действующие окна */}
                <FactActiveWindowsBlock totalFactActiveWindows={totalFactActiveWindows} onClick={() => socket.send(JSON.stringify({ action: 'get_fact_active_windows' }))} />

                {/* Простой по окнам */}
                <DelayByWindowsBlock totalDelayByWindows={totalDelayByWindows} onClick={() => socket.send(JSON.stringify({ action: 'get_delay_by_windows' }))} />

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
                      {/* Данные добавляются через JS */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {/* Модальное окно для отображения данных (исходя из категории действия в switch) */}
      {activeModal === 'active' && (
        <ActiveWindowsBlockModal data={modalData} isOpen={true} onClose={closeModal} />
      )}
      {activeModal === 'deep' && (
        <DeepRecordingBlockModal data={modalData} isOpen={true} onClose={closeModal} />
      )}
      {activeModal === 'avg' && (
          <AvgTimeModal data={modalData} isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
}

export default Main;
