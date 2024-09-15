import React from 'react';
import PropTypes from 'prop-types';

const CustomButton = ({ className, value1, value2, value3, onClick }) => {
    return (
        <div className="mb-4">
            <button
                type="button"
                className={`w-full p-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
                onClick={() => onClick(value3)}
            >
                <div className="text-lg font-semibold mb-1">{value1}</div>
                <div className="text-sm">{value2}</div>
                <div className="text-xs mt-2 opacity-70">{value3}</div>
            </button>
        </div>
    );
};

CustomButton.propTypes = {
    className: PropTypes.string,
    value1: PropTypes.string.isRequired,
    value2: PropTypes.string.isRequired,
    value3: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default CustomButton;