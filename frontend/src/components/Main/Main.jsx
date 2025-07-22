import React from 'react';
import MainBlocks from './MainBlocks/MainBlocks.jsx';
import MainInfo from './MainInfo/MainInfo.jsx';
import MainTable from './MainTable/MainTable.jsx';
import Footer from '../Footer/Footer.jsx';


const Main = () => {
    return (
        <div id="layoutSidenav_content">
            <main>
                <div class="container-fluid px-4">

                    <MainInfo />

                    <MainBlocks />

                    <MainTable />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Main;