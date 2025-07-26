import React from 'react';
import Block from './../Block';

const ActiveWindowsBlock = ({ totalActiveWindows, onClick }) => {
    return (
        <Block
            title="Активные окна"
            value={totalActiveWindows}
            onClick={onClick}
            bgColor="bg-warning"
        />
    );
};

export default ActiveWindowsBlock;