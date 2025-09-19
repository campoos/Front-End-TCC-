import './Sidebar.css'
import {Link, useLocation} from "react-router-dom"
import Logo from "../../assets/logo.png"

import DashboardIcon from "../../assets/sidebar-icons/dashboard-icon.png"
import RecursosIcon from "../../assets/sidebar-icons/recursos-icon.png"
import RankingIcon from "../../assets/sidebar-icons/ranking-icon.png"
import ConfiguracoesIcon from "../../assets/sidebar-icons/configuracoes-icon.png"

function Sidebar() {
  const location = useLocation()

  return (
    <>
      <div id="containerSidebar">
          <div id="sidebarHeader">
            <img src={Logo} alt=""/>
            <span>Analytica AI</span>
          </div>
          <div id="sidebarMenu">
            <Link to="/dashboards" className={`sidebarItem ${location.pathname === "/dashboards" ? "active" : ""}`}>
              <img src={DashboardIcon} alt="DashboardsIcon"/>
              <span>Dashboards</span>
            </Link>
            <Link to="/recursos" className={`sidebarItem ${location.pathname === "/recursos" ? "active" : ""}`}>
              <img src={RecursosIcon} alt="RecursosIcon"/>
              <span>Recursos</span>
            </Link>
            <Link to="/ranking" className={`sidebarItem ${location.pathname === "/ranking" ? "active" : ""}`}>
              <img src={RankingIcon} alt="RankingIcon"/>
              <span>Ranking</span>
            </Link>
            <Link to="/configuracoes" className={`sidebarItem ${location.pathname === "/configuracoes" ? "active" : ""}`}>
              <img src={ConfiguracoesIcon} alt="ConfiguracoesIcon"/>
              <span>Configurações</span>
            </Link>
          </div>
      </div>
    </>
  )
}

export default Sidebar
