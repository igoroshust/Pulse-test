import React from 'react';
import './Modal.css'; // Импортируйте CSS для стилизации

const Modal = ({ id, title, children, isOpen, onClose }) => {
    if (!isOpen) return null; // Если модальное окно не открыто, ничего не рендерим

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(); // Закрываем модальное окно при клике на оверлей
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
