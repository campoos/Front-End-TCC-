import React from "react";

import HomePage from './pages/home/Home.jsx'; // Importe a nova página Home
import LoginPage from './pages/login/Login.jsx'; // Importe a sua página de login

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function AppRoutes() {
    return (
      <>
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </>
    )
}

export default AppRoutes