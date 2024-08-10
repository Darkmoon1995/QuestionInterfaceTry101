import React from 'react';
import PropTypes from 'prop-types';

const CustomButton = ({ value1, value2, value3, onClick }) => {
    return (
        <div className="inner">
            <button
                type="button"
                id="backgroundcolor3"
                className="MainButtonMenu"
                onClick={() => onClick(value3)}
            >
                <span className="aboveText" style={{ fontSize: '1.6rem' }}>{value1}</span>
                <br />
                <span className="text-nowrap" style={{ fontSize: '1rem' }}>{value2}</span>
            </button>
        </div>
    );
};

CustomButton.propTypes = {
    value1: PropTypes.string.isRequired,
    value2: PropTypes.string.isRequired,
    value3: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default CustomButton;
