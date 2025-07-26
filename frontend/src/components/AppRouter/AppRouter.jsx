import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './../Header/Header';
import Sidebar from './../Sidebar/Sidebar';
import Main from './../Main/Main';
import About from './../About/About';
import Navbar from './../Navbar/Navbar';

const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                document.title = "Главная страница";
                break;
            case '/about-page':
                document.title = "Информация о филиале";
                break;
            default:
                document.title = "Страница не найдена";
        }
    }, [location]);

    return null; // Этот компонент ничего не рендерит
};

const AppRouter = () => {

    // Бургер-меню
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);

    // Переключение состояния сайтбара
    const toggleSidebar = () => {
        setIsSidebarToggled(prevState => !prevState); // Обновляем состояние, инвертируя предыдущее значение
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled); // Сохраняем текущее состояние в localStorage
    };

    return (
        <Router>
            <div className={`App ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
                <Navbar />
                <Header toggleSidebar={toggleSidebar} />

                {/* Компонент для обновления заголовка */}
                <TitleUpdater />

                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/about-page" element={<About />} />
                </Routes>

                <div id="layoutSidenav">
                    <Sidebar />
                </div>
            </div>
        </Router>
    );
};

export default AppRouter;
