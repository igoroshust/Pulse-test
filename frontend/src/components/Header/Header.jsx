import React from 'react';

const Header = ({ toggleSidebar }) => {
    return (
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <div><a href="/"><img src="./assets/img/logo-transparent.png" alt="mfc-logo" class="logo logo-header" /></a></div>
        <a class="navbar-brand ps-3" href="/">Пульс</a>
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={toggleSidebar}><i class="fas fa-bars"></i></button>
        <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        {/* Поиск по сайту */}
            {/* <div class="input-group"> */}
                {/* <input class="form-control" type="text" placeholder="Поиск..." aria-label="Поиск..." aria-describedby="btnNavbarSearch" /> */}
                {/* <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button> */}
        {/* </div> */}
        </form>
        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#!">Настройки</a></li>
                    <li><a class="dropdown-item" href="#!">Журнал</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#!">Выйти</a></li>
                </ul>
            </li>
        </ul>
    </nav>
    );
};

export default Header;