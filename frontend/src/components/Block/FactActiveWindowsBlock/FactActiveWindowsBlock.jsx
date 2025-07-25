import React from 'react';
import Block from './../Block';

const FactActiveWindowsBlock = ({ totalFactActiveWindows, onClick }) => {
    return (
        <Block
            title="Действующие окна"
            bgColor="bg-success"
            value={totalFactActiveWindows}
            onClick={onClick}
        />
    );
};

export default FactActiveWindowsBlock;