import React from 'react';
import clsx from 'clsx';

const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md', 
    className, 
    disabled, 
    title,
    icon,
    type = 'button'
}) => {
    const baseStyles = "rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200 dark:shadow-none border border-transparent",
        secondary: "bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 border border-transparent",
        outline: "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5",
        ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 border border-transparent",
        danger: "bg-red-500 text-white hover:bg-red-600 border border-transparent"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs sm:text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            title={title}
        >
            {icon && <i className={clsx("fas", icon)}></i>}
            {children}
        </button>
    );
};

export default Button;
