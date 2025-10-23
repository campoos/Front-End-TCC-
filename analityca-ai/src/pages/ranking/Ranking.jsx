import './Ranking.css'
import Sidebar from '../../components/sidebar/Sidebar'
import UserIcon from "../../assets/usuario-icon.png" 
function RankingPage() {
  return (
    <>
        <div id="telaRanking">
            <Sidebar/>

            <div id="containerRanking">
              <div class="container">

                  <main class="mainContent">
                      <h1>Ranking Do Aluno: Jheniffer de Souza Rodrigues</h1>
                      
                      <hr  class="linha"/>
                      
                      <div class="header-info">
                          <div class="user-perfil">
                              <img src={UserIcon} alt="" />
                              <div class="user-informação-text">
                                  <span>Jheniffer de Souza Rodrigues </span>
                                  <small>3° Ano B</small>
                              </div>
                              </div>
                          <div class="filtros">
                              <label for="disciplina">Disciplina:</label>
                              <select id="disciplina" class="dropdown">
                                  <option>Todas as Disciplinas</option>
                              </select>

                              <label for="periodo">Período:</label>
                              <select id="periodo" class="dropdown">
                                  <option>Todos Semestres</option>
                              </select>
                          </div>
                      </div>

                      <div class="ranking-tabela">
                          <div class="ranking-header">
                              <div class="coluna-ranking">RANKING</div>
                              <div class="coluna-media">MÉDIA</div>
                              <div class="coluna-nome">NOME DO ALUNO</div>
                          </div>
                          
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">1°</div>
                              <div class="coluna-media borrado">10</div>
                              <div class="coluna-nome borrado">Maria Souza Oliveira</div>
                          </div>

                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">2°</div>
                              <div class="coluna-media borrado">9.5</div>
                              <div class="coluna-nome borrado">João Ricardo Silva</div>
                          </div>
                          
                          <div class="ranking-row student-row">
                              <div class="coluna-ranking">3°</div>
                              <div class="coluna-media">9.1</div>
                              <div class="coluna-nome">Jheniffer de Souza Rodrigues</div>
                          </div>
                          
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">4°</div>
                              <div class="coluna-media borrado">8.5</div>
                              <div class="coluna-nome borrado">Fernanda Lima Costa</div>
                          </div>
                          
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">5°</div>
                              <div class="coluna-media borrado">8.3</div>
                              <div class="coluna-nome borrado">Lucas Pereira Melo</div>
                          </div>
                          
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">6°</div>
                              <div class="coluna-media borrado">8.1</div>
                              <div class="coluna-nome borrado">Gabriela Nunes Pinto</div>
                          </div>
                          
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">7°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">8°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">9°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">10°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">11°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div> 
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">12°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">13°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">14°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">15°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">16°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">17°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">18°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">19°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">20°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">21°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">22°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">23°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">24°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">25°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">26°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">27°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">28°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">29°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div>
                           
                          <div class="ranking-row blurred-row">
                              <div class="coluna-ranking">30°°</div>
                              <div class="coluna-media borrado">7.9</div>
                              <div class="coluna-nome borrado">Pedro Henrique Santos</div>
                          </div> 
                      </div>
                  </main>
                  
              </div>


            </div>
        </div>
    </>
  )
}

export default RankingPage

