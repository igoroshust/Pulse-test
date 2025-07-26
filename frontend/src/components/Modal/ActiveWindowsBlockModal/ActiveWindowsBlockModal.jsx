import React from 'react';
import Modal from './../Modal';

const ActiveWindowsBlockModal = ({ data, isOpen, onClose }) => {
    return (
        <Modal
            id="dataModal"
            title="Данные"
            isOpen={isOpen}
            onClose={onClose}
        >
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
        </Modal>
    );
};

export default ActiveWindowsBlockModal;