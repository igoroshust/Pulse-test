import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';
import { defaultConfig } from './../../config/config.ts';

import Footer from './../Footer/Footer';
import Block from './../Block/Block';
import ActiveWindowsBlock from './../Block/ActiveWindowsBlock/ActiveWindowsBlock';
import DeepRecordingBlock from './../Block/DeepRecordingBlock/DeepRecordingBlock';
import FactActiveWindowsBlock from './../Block/FactActiveWindowsBlock/FactActiveWindowsBlock';
import DelayByWindowsBlock from './../Block/DelayByWindowsBlock/DelayByWindowsBlock';

import ActiveWindowsBlockModal from './../Modal/ActiveWindowsBlockModal/ActiveWindowsBlockModal';
import DeepRecordingBlockModal from './../Modal/DeepRecordingBlockModal/DeepRecordingBlockModal';
import AvgTimeModal from './../Modal/AvgTimeModal/AvgTimeModal';

const Home = () => {
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [dataTable, setDataTable] = useState(null);
  const [totalActiveWindows, setTotalActiveWindows] = useState(0);
  const [totalFactActiveWindows, setTotalFactActiveWindows] = useState(0);
  const [totalDelayByWindows, setTotalDelayByWindows] = useState(0);
  const [timer, setTimer] = useState('');
  const [modalData, setModalData] = useState([]);
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

      // Обработка данных и открытие модальных окон
      if (data.action === 'get_active_windows' || data.action === 'get_fact_active_windows' || data.action === 'get_delay_by_windows' || data.action === 'get_active_windows_by_filial' || data.action === 'get_fact_active_windows_by_filial' || data.action === 'get_delay_by_windows_by_filial') {
        openModal(data.data, 'active');
        return;
      } else if (data.action === 'get_deep_recording' || data.action === 'get_deep_recording_by_filial') {
        openModal(data.data, 'deep');
        return;
      } else if (data.action === 'get_avg_time_by_filial') {
        openModal(data.data, 'avg');
        return;
      }

      setData(data.data);
      let activeWindowsSum = 0;
      let factActiveWindowsSum = 0;
      let delayByWindowsSum = 0;

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

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}:${seconds}`;
      setTimer(currentTime);
    };
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
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

      // Добавляем обработчик клика для ячейки "Активные окна"
      const activeWindowsCell = row.querySelector('.filial-active-windows-count');
      activeWindowsCell.addEventListener('click', () => {
        socket.send(JSON.stringify({ action: 'get_active_windows_by_filial', filial: item.filial_name }));
      });

      // Добавляем обработчик клика для ячейки "Действующие окна"
      const factActiveWindowsCell = row.querySelector('.filial-fact-active-windows-count');
      factActiveWindowsCell.addEventListener('click', () => {
        socket.send(JSON.stringify({ action: 'get_fact_active_windows_by_filial', filial: item.filial_name }));
      });

      // Добавляем обработчик клика для ячейки "Простой по окнам"
      const delayByWindowsCell = row.querySelector('.filial-delay-by-windows');
      delayByWindowsCell.addEventListener('click', () => {
        socket.send(JSON.stringify({ action: 'get_delay_by_windows_by_filial', filial: item.filial_name }));
      });

      // Добавляем обработчик клика для ячейки "Глубина записи"
      const deepRecordingCell = row.querySelector('.filial-deep-recording');
      deepRecordingCell.addEventListener('click', () => {
        socket.send(JSON.stringify({ action: 'get_deep_recording_by_filial', filial: item.filial_name }));
      });

      // Добавляем обработчик клика для ячейки "Среднее время"
      const avgTimeCell = row.querySelector('.filial-avg-time');
      avgTimeCell.addEventListener('click', () => {
        socket.send(JSON.stringify({ action: 'get_avg_time_by_filial', filial: item.filial_name }));
      });
    });

    const table = new DataTable('#datatablesSimple', {
        ...defaultConfig, // Подгружаем изменённые настройки конфигурации (русификация)
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
                <DeepRecordingBlock onClick={() => socket.send(JSON.stringify({ action: 'get_deep_recording' }))} />
                <ActiveWindowsBlock totalActiveWindows={totalActiveWindows} onClick={() => socket.send(JSON.stringify({ action: 'get_active_windows' }))} />
                <FactActiveWindowsBlock totalFactActiveWindows={totalFactActiveWindows} onClick={() => socket.send(JSON.stringify({ action: 'get_fact_active_windows' }))} />
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

      {/* Модальное окно для отображения данных */}
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

export default Home;
