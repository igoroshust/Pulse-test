import React, { useEffect, useState } from 'react';

import Footer from './../Footer/Footer';

function About() {
  const [filial, setFilial] = useState('');
  const [date, setDate] = useState('');
  const [range, setRange] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Получаем данные из localStorage
    const storedFilial = localStorage.getItem('filial');
    const storedDate = localStorage.getItem('date');
    const storedRange = localStorage.getItem('range');

    // Устанавливаем данные в состояние
    setFilial(storedFilial || 'Неизвестно');
    setFilial(storedFilial || 'Неизвестно');
    setDate(storedDate || 'Неизвестно');
    setRange(storedRange || 'Неизвестно');

    // Устанавливаем WebSocket соединение
    const socket = new WebSocket('ws://localhost:5050/ws/about_page_updates/');

    socket.onopen = function() {
      console.log('Соединение установлено! (About)');
      // Отправляем запрос на получение данных
      socket.send(JSON.stringify({
        action: 'apply',
        filial: storedFilial,
        date: storedDate,
        range: storedRange
      }));
    };

    socket.onmessage = function(event) {
      const responseData = JSON.parse(event.data);
      // Обновляем состояние с полученными данными
      setData(responseData.data);
    };

    socket.onerror = function(error) {
      console.error('Ошибка WebSocket:', error);
    };

    socket.onclose = function(event) {
      console.log('Соединение закрыто', event);
    };

    // Очистка WebSocket при размонтировании компонента
    return () => {
      socket.close();
    };
  }, []); // Пустой массив зависимостей, чтобы выполнить эффект только один раз при монтировании

  // Функция для открытия модального окна и заполнения данными
  const openModal = (modalData) => {
    const modalTableBody = document.getElementById('modalTableBody');
    modalTableBody.innerHTML = ''; // Очищаем предыдущие данные
    modalData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.window}</td>
        <td>${item.operator}</td>
        <td>${item.filial}</td>
        <td>${item.status}</td>
      `;
      modalTableBody.appendChild(row);
    });

    // Показываем модальное окно
    const modal = new window.bootstrap.Modal(document.getElementById('dataModal'));
    modal.show();
  };

  return (
    <div>
      <div id="layoutSidenav">
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Информация о филиале</h1>
              <h5 className="mt-6" id="filial">МФЦ Кыра</h5>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active" id="date">Дата: {date}</li>
                <li className="breadcrumb-item active" id="range">Диапазон: {range}</li>
              </ol>
              <div className="row">
                {/* Ваши карточки с данными */}
              </div>
              <div className="card mb-4">
                <div className="card-header">
                  <div><i className="fas fa-table me-1"></i> Информация по филиалам</div>
                  <div id="timer">00:00:00</div>
                </div>
                <div className="card-body">
                  <table id="datatablesSimple">
                    <thead>
                      <tr>
                        <th>Окно</th>
                        <th>Оператор</th>
                        <th>Активность окна</th>
                        <th>Фактическая активность окна</th>
                        <th>Обслужено талонов</th>
                        <th>Пауза</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.window}</td>
                          <td>{item.operator}</td>
                          <td>{item.activity}</td>
                          <td>{item.actualActivity}</td>
                          <td>{item.talonsServed}</td>
                          <td>{item.pause}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>

         <Footer />

        </div>
      </div>

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
                    <th>Текущий статус</th>
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
    </div>
  );
}

export default About;
