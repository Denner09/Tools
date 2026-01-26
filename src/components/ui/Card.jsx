import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, noPadding = false }) => {
    return (
        <div 
            className={clsx(
                "rounded-xl shadow-lg border overflow-hidden relative transition-all",
                !noPadding && "p-6",
                className
            )}
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-card)' 
            }}
        >
            {children}
        </div>
    );
};

export default Card;
