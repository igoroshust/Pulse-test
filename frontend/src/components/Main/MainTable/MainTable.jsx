import React from 'react';
import '../../../scripts/components/update-timer.js';

const MainTable = () => {
    return (
        <div class="card mb-4">
            <div class="card-header">
                <div><i class="fas fa-table me-1"></i>
                    Информация по филиалам</div>
                    <div id="timer">00:00:00</div>
                </div>
                <div class="card-body">
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
                            <tr>
                                {/*  Добавляем данные через JS */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    );
};

export default MainTable;