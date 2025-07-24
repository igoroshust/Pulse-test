import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Navbar from './components/Navbar/Navbar';

function App() {

    // Бургер-меню
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    // Переключание состояния сайтбара
    const toggleSidebar = () => {
        setIsSidebarToggled(prevState => !prevState); // Обновляем состояние, инвертируя предыдущее значение
        localStorage.setItem('sb|sidebar-toggle', !isSidebarToggled); // Сохраняем текущее состояние в localStorage
      };

  return (
    <Router>
      <div className={`App ${isSidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
        <Navbar />
        <Header toggleSidebar={toggleSidebar} />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-page" element={<About />} />
        </Routes>

        <div id="layoutSidenav">
            <Sidebar />

        </div>

      </div>
    </Router>
  );
}

export default App;
