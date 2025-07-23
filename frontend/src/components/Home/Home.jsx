import React, { useEffect, useState } from 'react';
import '../../scripts/home.js'; // Убедитесь, что этот файл не содержит лишнего кода

function Home() {
  const [data, setData] = useState([]);
  const [selectedFilial, setSelectedFilial] = useState('');
  const [socket, setSocket] = useState(null);

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
           data.action === 'get_delay_by_windows') {
        openModal(data.data);
        return;
      } else if (data.action === 'get_deep_recording') {
        openModal_deepRecording(data.data);
        return;
      }

      // Обновляем данные для таблицы
      setData(data.data);
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

  // Обработчик клика для карточки "Активные окна"
  const handleActiveWindowsClick = () => {
    socket.send(JSON.stringify({ action: 'get_active_windows' }));
  };

  // Обработчик клика для карточки "Действующие окна"
  const handleActiveSessionsClick = () => {
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
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <div><a href="./index.html"><img src="./assets/img/logo-transparent.png" alt="mfc-logo" className="logo logo-header" /></a></div>
        <a className="navbar-brand ps-3" href="./index.html">Пульс</a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
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
              <h1 className="mt-4">МФЦ Забайкальского края</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Статистика</li>
              </ol>
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-primary text-white mb-4" id="deepRecordingTotal" onClick={handleDeepRecordingClick}>
                    <div className="card-body">Глубина записи по талонам</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">Подробнее</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-warning text-white mb-4" id="activeWindowsCard" onClick={handleActiveWindowsClick}>
                    <div className="card-body">Активные окна</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">0</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-success text-white mb-4" id="activeSessionsCard" onClick={handleActiveSessionsClick}>
                    <div className="card-body">Действующие окна</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">0</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="card bg-danger text-white mb-4" id="delayByWindows" onClick={handleDelayByWindowsClick}>
                    <div className="card-body">Простой по окнам</div>
                    <div className="card-footer d-flex align-items-center justify-content-between">
                      <a className="small text-white stretched-link" href="#">0</a>
                      <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                    </div>
                  </div>
                </div>
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
                        <th>Филиал</th>
                        <th>Активные окна</th>
                        <th>Действующие окна</th>
                        <th>Простой по окнам</th>
                        <th>Глубина записи по талонам</th>
                        <th>Среднее время ожидания</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.filial_name}</td>
                          <td>{item.active_windows_count}</td>
                          <td>{item.fact_active_windows_count}</td>
                          <td>{item.delay_by_windows}</td>
                          <td>{item.deep_recording}</td>
                          <td>{item.avg_time}</td>
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
                <div className="text-muted">Разработано &copy; ОПТ</div>
                <div>
                  <a href="#">Политика конфиденциальности</a>
                </div>
              </div>
            </div>
          </footer>
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
    </div>
  );
}

export default Home;