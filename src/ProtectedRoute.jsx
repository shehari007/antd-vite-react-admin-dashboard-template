import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

export const ProtectedRoute = () => {

    const isAuthenticated = localStorage.getItem('Auth')
    if (!isAuthenticated) {
        return <Navigate to='/signin' replace />
    }
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};