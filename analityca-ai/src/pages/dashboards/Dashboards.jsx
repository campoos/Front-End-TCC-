import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png" 

import InfoIcon from "../../assets/dashboards/info-icon.png"
import CheckIcon from "../../assets/dashboards/check-icon.png"
import ChartICon from "../../assets/dashboards/chart-icon.png"

import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardsPage() {

  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Dados de exemplo, você irá substituir por dados reais da API
    const presenca = 90;
    const faltas = 10;

    setChartData({
      labels: ['Presença', 'Faltas'],
      datasets: [
        {
          label: 'Frequência',
          data: [presenca, faltas],
          backgroundColor: [
            '#9A78F5', // Cor para presença (roxo claro do design)
            '#CFC4F8', // Cor para faltas (roxo escuro do design)
          ],
          borderWidth: 0, // Remove a borda branca
        },
      ],
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%', // Faz o gráfico de rosca
      plugins: {
        legend: {
          display: false, // Oculta a legenda padrão do Chart.js
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}%`;
            }
          }
        }
      }
    });
  }, []);

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
                  <div id="containerInformacoesDesempenho">
                    <div id="informacoesGerais">
                      <div id="informacoesTitle">
                        <img src={InfoIcon} alt="iconeInfo"/>
                        <label for="">Informações Gerais</label>
                      </div>
                      <div id="informacoesContent">
                        <span>Matrícula: 00000000</span>
                        <span>Data de Nascimeto: 00/00/0000</span>
                        <span>Responsável: Nome da responsável</span>
                        <span>Contato: 11 0 00000-0000</span>
                        <span>Email: exemplo@gmail.com</span>
                      </div>
                    </div>
                    <div id="desempenho">
                      <div id="desempenhoTitle">
                        <img src={CheckIcon} alt="iconeDesempenho"/>
                        <label for="">Desempenho na Matéria</label>
                      </div>
                      <div id="informacoesContent">
                        <div id="notaMedia">
                          <h1>9.8</h1>
                          <h2>▪</h2>
                          <span>0.3 no último semestre</span>
                        </div>
                      </div>
                      <h4>Média do Semestre</h4>
                    </div>
                  </div>
                  <div id="frequencia">
                    <div id="frequenciaTitle">
                        <img src={ChartICon} alt="iconeChart"/>
                        <label for="">Frequência no Período</label>
                      </div>
                      <div id="graficoContainer">
                        <div id="grafico">
                          <Doughnut data={chartData} options={chartOptions} />
                        </div>
                        <div id="textoGrafico">
                          <h1>90%</h1>
                          <label For="grafico">Frequência</label>
                        </div>
                      </div>
                      <div id="labelsFrequencia">
                        <div id="labelPresenca" className='label'>
                          <div id="circlePresenca"></div>
                          <span>Presenças (90%)</span>
                        </div>
                        <div id="labelFalta" className='label'>
                          <div id="circleFalta"></div>
                          <span>Faltas (10%)</span>
                        </div>
                      </div>
                  </div>
                  <div id="notas"></div>
                </div>
                <hr/>
            </div>
        </div>
    </>
  )
}

export default DashboardsPage
