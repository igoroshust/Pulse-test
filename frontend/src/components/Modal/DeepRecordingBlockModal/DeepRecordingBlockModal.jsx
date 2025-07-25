import React from 'react';
import Modal from './../Modal';

const DeepRecordingBlockModal = ({ data, isOpen, onClose }) => {
    return (
        <Modal
            id="dataModal-deepRecordingTable"
            title="Данные по глубине записи"
            isOpen={isOpen}
            onClose={onClose}
        >
        <table className="table">
                            <thead>
                                <tr>
                                    <th>Филиал</th>
                                    <th>Обслужено</th>
                                    <th>В очереди</th>
                                    <th>Сброшено</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.filial_name}</td>
                                        <td>{item.total_talons}</td>
                                        <td>{item.waiting_talons}</td>
                                        <td>{item.not_accepted_talons}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
        </Modal>
    );
};

export default DeepRecordingBlockModal;