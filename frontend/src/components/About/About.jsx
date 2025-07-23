import React, { useEffect, useState } from 'react';

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
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <div><a href="./index.html"><img src="./assets/img/logo-transparent.png" alt="mfc-logo" className="logo logo-header" /></a></div>
        <a className="navbar-brand ps-3" href="./index.html">Пульс</a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group"></div>
        </form>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#!">Настройки</a></li>
              <li><a className="dropdown-item" href="#!">Журнал</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#!">Выйти</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Навигация</div>
                <a className="nav-link" href="./index.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer"></i></div>
                  Главная
                </a>
                <a className="nav-link" href="./about-page.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                  О филиале
                </a>
                <div className="sb-sidenav-menu-heading">Интерфейс</div>
                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                  <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                  Настройки
                  <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                </a>
                <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                  <nav className="sb-sidenav-menu-nested nav">
                    <a className="nav-link" href="layout-static.html">Static Navigation</a>
                    <a className="nav-link" href="layout-sidenav-light.html">Light Sidenav</a>
                  </nav>
                </div>
                <div className="sb-sidenav-menu-heading">Дополнительно</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                  Графики
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                  Таблицы
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Пользователь:</div>
              Тестов Тест Тестович
            </div>
          </nav>
        </div>
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
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Разработано &copy; ОПТ </div>
                <div>
                  <a href="#">Политика конфиденциальности</a>
                </div>
              </div>
            </div>
          </footer>
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
