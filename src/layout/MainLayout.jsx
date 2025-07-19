import React from 'react';
import Header from '../features/common/Header';
import Sidebar from '../features/common/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ sidebarLinks = [], title = "Maestro", onLogout }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header title={title} onLogout={onLogout} />
            {/* <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar links={sidebarLinks} />
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                </div>
            </div> */}
            <Outlet />
        </div>
    );
};

export default MainLayout;
