import React from 'react';
import Block from './../Block';

const DelayByWindowsBlock = ({ totalDelayByWindows, onClick }) => {
    return (
        <Block
            title="Простой по окнам"
            value={totalDelayByWindows}
            onClick={onClick}
            bgColor="bg-danger"
        />
    );
};

export default DelayByWindowsBlock;