// ActiveWindowsModalContent.js
import React from 'react';

const ActiveWindowsModalContent = ({ data }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Окно</th>
                    <th>Оператор</th>
                    <th>Филиал</th>
                    <th>Время</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.window_number}</td>
                        <td>{item.fio || 'Неизвестно'}</td>
                        <td>{item.filial_name}</td>
                        <td>{Math.ceil(item.working_minutes) + ' мин.' || 'Неизвестно'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ActiveWindowsModalContent;
