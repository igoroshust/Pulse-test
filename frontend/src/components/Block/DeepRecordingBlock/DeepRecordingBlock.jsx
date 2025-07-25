import React from 'react';
import Block from './../Block';

const DeepRecordingBlock = ({ onClick }) => {
    return (
        <Block
            title="Глубина записи по талонам"
            value="Подробнее"
            onClick = {onClick}
            bgColor="bg-primary"
        />
    );
};

export default DeepRecordingBlock;