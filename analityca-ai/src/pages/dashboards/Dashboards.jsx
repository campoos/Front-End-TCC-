import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png" 

import InfoIcon from "../../assets/dashboards/info-icon.png"
import CheckIcon from "../../assets/dashboards/check-icon.png"
import ChartICon from "../../assets/dashboards/chart-icon.png"
import PerformIcon from "../../assets/dashboards/perform-icon.png"
import relatoriosIcon from "../../assets/dashboards/relatorios-insights-icon.png"

import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale, // eixo X (nomes das categorias)
  LinearScale,   // eixo Y (valores numéricos)
  BarElement,    // o elemento "barra"
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);


function DashboardsPage() {

  const dataUser = JSON.parse(localStorage.getItem("userData"))

  console.log(dataUser)

  const dataPizza = {
    labels: ["Presença", "Falta"],
    datasets: [
      {
        label: "Frequência (%)",
        data: [90, 10],
        backgroundColor: [
          "rgb(222, 212, 252)",
          "rgb(125, 83, 243)"
        ],
        borderColor: [
          "rgba(255, 255, 255, 1)"
        ],
        borderWidth: 4,
      },
    ],
  };

  const dataBarra = {
    labels: ["Atividade", "Prova", "Seminário", "Prova"], 
    datasets: [
      {
        label: "Notas",
        data: [8.0, 9.2, 7.3, 10.0], 
        backgroundColor: "rgb(125, 83, 243)", 
        borderRadius: 2,
        barPercentage: 0.7,     
        categoryPercentage: 0.6,
      },
    ]
  };

  const optionsPizza = {
    plugins: {
      legend: { display: false },
      datalabels: {
       display: false
      }
    }
  };

  const optionsBarra = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        top: 23
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
      anchor: "end", // onde fica preso (start, center, end)
      align: "top",  // posição em relação à barra (top, bottom, center)
      color: "rgb()", // cor do texto
      font: {
        weight: "thin",
        size: 14,
      },
      formatter: (value) => value.toFixed(1)
    }
    },
    scales: {
      x: {
        ticks: { color: "#000" },
        grid: { display: false },
        barPercentage: 0.2,
        categoryPercentage: 0.5
      },
      y: {
        grid: { display: false },
        beginAtZero: true
      }
    }
  };

  return (
    <>
        <div id="telaDashboards">
            <Sidebar/>
            <div id="containerDashboards">
                <h1 id='title'>Dashboard Do Aluno: {dataUser.nome}</h1>
                <hr/>
                <div id="usuarioContainer">
                  <img src={UserIcon} alt="" />
                  <div id="userContent">
                    <h1>{dataUser.nome}</h1>
                    <span>{dataUser.turma.turma}</span>
                  </div>
                </div>
                <div id="filtros">
                  <div className="filtro">
                    <label htmlFor="displicina">Disciplina:</label>
                    <select name="disciplina" id="disciplina" defaultValue={"Todas as Disciplinas"}>
                      <option value="Todas as Disciplinas">Todas as Disciplinas</option>
                      <option value="Historia">História</option>
                      <option value="Geografia">Geografia</option>
                    </select>
                  </div>
                  <div className="filtro">
                    <label htmlFor="periodo">Período:</label>
                    <select name="periodo" id="periodo" defaultValue={"Todas os Periodos"}>
                      <option value="Todas os Periodos">Todas os Períodos</option>
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
                        <label htmlFor="">Informações Gerais</label>
                      </div>
                      <div id="informacoesContent">
                        <span>Matrícula: {dataUser.matricula}</span>
                        <span>Data de Nascimeto: {dataUser.data_nascimento}</span>
                        <span>Contato: {dataUser.telefone}</span>
                        <span>Email: {dataUser.email}</span>
                      </div>
                    </div>
                    <div id="desempenho">
                      <div id="desempenhoTitle">
                        <img src={CheckIcon} alt="iconeDesempenho"/>
                        <label htmlFor="">Desempenho na Matéria</label>
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
                      <label htmlFor="">Frequência no Período</label>
                    </div>
                    <div id="graficoContainer">
                      <div id="grafico">
                        <Pie data={dataPizza} options={optionsPizza}/>
                      </div>
                      <div id="textoGrafico">
                        <h1>90%</h1>
                        <label htmlFor="grafico">Frequência</label>
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
                  <div id="notas">
                    <div id="notasTitle">
                      <img src={PerformIcon} alt="iconePerform"/>
                      <label htmlFor="">Desempenho em “Máteria”</label>
                    </div>
                    <div id="graficoBarra">
                      <Bar data={dataBarra} options={optionsBarra}/>
                    </div>
                  </div>
                </div>
                <hr/>
                <div id="containerInsights">
                  <div id="headerInsights">
                    <img src={relatoriosIcon} alt="" />
                    <h1>Relatórios e Insights por Matéria</h1>
                  </div>
                  <div id="insightsContainer">
                    <div className="insight">
                      <h2>Avaliação de matemática</h2>
                      <h3>01/06/2025</h3>
                      <span>Com excelente compreensão de álgebra e geometria. As notas de prova indicam grande domínio do conteúdo. As notas de prova indicam grande domínio do conteúdo e bom entendimento sobre o conteúdo aprendido. </span>
                    </div>
                    <div className="insight">
                      <h2>Seminário de Matemática</h2>
                      <h3>26/06/2025</h3>
                      <span>As notas de prova indicam grande domínio do conteúdo e bom entendimento sobre o conteúdo aprendido. </span>
                    </div>
                    <div className="insight">
                      <h2>Avaliação de matemática</h2>
                      <h3>01/06/2025</h3>
                      <span>Com excelente compreensão de álgebra e geometria. As notas de prova indicam grande domínio do conteúdo.</span>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DashboardsPage
