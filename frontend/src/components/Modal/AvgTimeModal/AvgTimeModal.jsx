import React from 'react';
import Modal from './../Modal';

const AvgTimeModal = ({ data, isOpen, onClose }) => {
    return (
        <Modal
            id="dataModal-avgTimeTable"
            title="Данные"
            isOpen={isOpen}
            onClose={onClose}
        >
        <table className="table">
                            <thead>
                                <tr>
                                    <th>Талон</th>
                                    <th>Заявитель</th>
                                    <th>Текущее время ожидания</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.talon_name}</td>
                                        <td>{item.fio}</td>
                                        <td>{item.current_time} мин.</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
        </Modal>
    );
};

export default AvgTimeModal;