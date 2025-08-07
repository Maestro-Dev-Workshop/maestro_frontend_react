import React from 'react';

const Header = ({ title = "My App", onLogout }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ccc'
        }}>
            <h1 style={{ fontSize: '20px' }}>{title}</h1>
            {onLogout && (
                <button onClick={onLogout} style={{ padding: '8px 12px' }}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Header;
