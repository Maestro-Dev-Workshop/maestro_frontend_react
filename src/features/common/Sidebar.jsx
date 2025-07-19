import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ title = "Menu", links = [], children }) => {
    return (
        <div style={{
            width: '250px',
            borderRight: '1px solid #ccc',
            padding: '15px',
            overflowY: 'auto'
        }}>
            <h3>{title}</h3>
            {links.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {links.map((link, idx) => (
                        <li key={idx} style={{ marginBottom: '10px' }}>
                            <Link to={link.path}>{link.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
            {children}
        </div>
    );
};

export default Sidebar;
