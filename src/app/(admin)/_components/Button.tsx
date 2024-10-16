import React from "react";

type ButtonProps = {
    confirmMessage: string;
    buttonText: string;
    buttonColor: string;
    onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ confirmMessage, buttonText, buttonColor, onClick }) => {
    const handleClick = () => {
        if (window.confirm(confirmMessage)) {
            onClick();
        }
    };

    return (
        <button className={`p-2 rounded text-white ${buttonColor}`} onClick={handleClick}>
            {buttonText}
        </button>
    );
};

export default Button;
