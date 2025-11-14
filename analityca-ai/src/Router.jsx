import React from "react";

import HomePage from './pages/home/Home.jsx'; // Importe a nova página Home
import LoginPage from './pages/login/Login.jsx'; // Importe a sua página de login
import DashboardsPage from "./pages/dashboards/Dashboards.jsx";
import RecursosPage from "./pages/recursos/Recursos.jsx";
import RankingPage from "./pages/ranking/Ranking.jsx";
import ConfiguracoesPage from "./pages/configuracoes/Configuracoes.jsx";
import RecuperarSenhaPage from "./pages/recuperar-senha/RecuperarSenha.jsx";
import EmailEnviadoPage from "./pages/email-enviado/EmailEnviado.jsx";
import ResetarSenhaPage from "./pages/resetarSenha/resetarSenha.jsx";
import SenhaResetadaPage from "./pages/SenhaResetada/senhaResetada.jsx";
import RecursosCriarPage from "./pages/recursos-criar/RecursosCriar.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function AppRoutes() {
    return (
      <>
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/dashboards" element={<DashboardsPage />}></Route>
            <Route path="/recursos" element={<RecursosPage />}></Route>
            <Route path="/ranking" element={<RankingPage />}></Route>
            <Route path="/configuracoes" element={<ConfiguracoesPage />}></Route>
            <Route path="/recuperar-senha" element={<RecuperarSenhaPage />}></Route>
            <Route path="/email-enviado" element={<EmailEnviadoPage />}></Route>
            <Route path="/resetar-senha" element={<ResetarSenhaPage />}></Route>
            <Route path="/senha-resetada" element={<SenhaResetadaPage />}></Route>
            <Route path="/recursos-criar" element={<RecursosCriarPage />}></Route>     
        </Routes>
      </>
    )
}

export default AppRoutes