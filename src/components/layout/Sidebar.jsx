import React from 'react';

const Sidebar = ({ children, className }) => {
    return (
        <aside 
            className={`w-64 h-full fixed left-0 top-0 overflow-y-auto border-r ${className}`}
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-card)' 
            }}
        >
            {children}
        </aside>
    );
};

export default Sidebar;
