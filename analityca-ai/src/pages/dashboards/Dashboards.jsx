import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png" 

function DashboardsPage() {
  return (
    <>
        <div id="telaDashboards">
            <Sidebar/>
            <div id="containerDashboards">
                <h1 id='title'>Dashboard Do Aluno: “nome do aluno”</h1>
                <hr/>
                <div id="usuarioContainer">
                  <img src={UserIcon} alt="" />
                  <div id="userContent">
                    <h1>"Nome do Aluno"</h1>
                    <span>1° Ano B</span>
                  </div>
                </div>
                <div id="filtros">
                  <div className="filtro">
                    <label For="displicina">Disciplina:</label>
                    <select name="disciplina" id="disciplina">
                      <option value="Todas as Disciplinas" selected>Todas as Disciplinas</option>
                      <option value="Historia">História</option>
                      <option value="Geografia">Geografia</option>
                    </select>
                  </div>
                  <div className="filtro">
                    <label For="periodo">Período:</label>
                    <select name="periodo" id="periodo">
                      <option value="Todas os Periodos" selected>Todas os Períodos</option>
                      <option value="1 semestre">1º Semestre -2025</option>
                      <option value="2 semestre">2º Semestre - 2025</option>
                    </select>
                  </div>
                </div>
                <div id="dashboards">
                 
                </div>
            </div>
        </div>
    </>
  )
}

export default DashboardsPage
