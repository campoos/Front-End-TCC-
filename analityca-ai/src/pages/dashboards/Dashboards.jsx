import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png" 

import React, { useState, useEffect } from 'react';

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

  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const dataUser = JSON.parse(localStorage.getItem("userData"))

  const userLevel = dataUser?.nivel_usuario

  // --- 2. Função para buscar dados com a API fetch, usando os ENDPOINTS FORNECIDOS ---
  const fetchData = async (endpoint, dataKey) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        // Se a resposta não for OK (ex: 404, 500), lança erro
        throw new Error(`HTTP error! status: ${response.status} ao buscar ${endpoint}`);
      }
      const data = await response.json();
      return data[dataKey] || [];
    } catch (error) {
      console.error(`Erro ao buscar dados do endpoint ${endpoint}:`, error);
      // Retorna array vazio para evitar quebra ao iterar no .map
      return []; 
    }
  };

  // --- 3. useEffect para carregar os dados ao montar o componente ---
  useEffect(() => {
    const loadFilters = async () => {
      if (!userLevel) return;

      const visible = getVisibleFilters(userLevel);

      // Fetch Matérias
      if (visible.materia) {
        // Usando o endpoint: http://localhost:8080/v1/analytica-ai/materia
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/materia', "materias"); 
        setMaterias(data);
      } 
      // Fetch Turmas
      if (visible.turma) {
        // Usando o endpoint: http://localhost:8080/v1/analytica-ai/turma
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/turma', "turmas"); 
        setTurmas(data);
      } 
      // Fetch Períodos (Semestres)
      if (visible.periodo) {
        // Usando o endpoint: http://localhost:8080/v1/analytica-ai/semestre
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/semestre', "semestres"); 
        setPeriodos(data);
      }
    };
  loadFilters();
 }, [userLevel]);

  const getVisibleFilters = (nivel) => {
    switch (nivel) {
        case 'aluno':
            return { materia: true, periodo: true, turma: false };
        case 'professor':
            return { materia: false, periodo: true, turma: true };
        case 'gestão':
            return { materia: true, periodo: true, turma: true };
    }
  };

  const getGeneralInfoContent = (user) => {
    const info = [];

    switch (user.nivel_usuario) {
      case 'aluno':
          info.push(
              <span key="matricula">Matrícula: {user.matricula}</span>,
              <span key="nascimento">Data de Nascimeto: {user.data_nascimento}</span>,
              <span key="contato">Contato: {user.telefone}</span>,
              <span key="email">Email: {user.email}</span>
          );
          break;
      case 'professor':
          info.push(
              <span key="contato">Contato: {user.telefone}</span>,
              <span key="nascimento">Data de Nascimeto: {user.data_nascimento}</span>,
              <span key="email">Email: {user.email}</span>
          );
          break;
      case 'gestão':
          info.push(
              <span key="email">Email: {user.email}</span>,
              <span key="contato">Contato: {user.telefone}</span>,
              <span key="nome">Nome Completo: {user.nome}</span> // Adicionando nome para Gestão
          );
          break; 
    }
      return info;
  };

  const generalInfoContent = getGeneralInfoContent(dataUser);

  const visibleFilters = getVisibleFilters(userLevel);
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
                    {dataUser.turma?.turma && (
                        <span>{dataUser.turma.turma}</span>
                    )}
                  </div>
                </div>
                <div id="filtros">
                  {visibleFilters.materia && (
                      <div className="filtro">
                          <label htmlFor="disciplina">Disciplina:</label>
                          <select name="disciplina" id="disciplina" defaultValue={"Todas as Disciplinas"}>
                              <option value="Todas as Disciplinas">Todas as Disciplinas</option>
                              {/* Renderização Dinâmica das Matérias */}
                              {materias.map((m) => (
                                <option 
                                  key={m.id_materia} 
                                  value={m.materia}
                                >
                                  {m.materia}
                                </option>
                              ))}
                          </select>
                      </div>
                  )}
                  {visibleFilters.turma && (
                      <div className="filtro">
                          <label htmlFor="turma">Turma:</label>
                          <select name="turma" id="turma" defaultValue={"Todas as Turmas"}>
                              <option value="Todas as Turmas">Todas as Turmas</option>
                              {turmas.map((t) => (
                                <option 
                                  key={t.id_turma} 
                                  value={t.turma}
                                >
                                  {t.turma}
                                </option>
                              ))}
                          </select>
                      </div>
                  )}
                  {visibleFilters.periodo && (
                      <div className="filtro">
                          <label htmlFor="periodo">Período:</label>
                          <select name="periodo" id="periodo" defaultValue={"Todas os Periodos"}>
                              <option value="Todas os Periodos">Todas os Períodos</option>
                              {periodos.map((p) => (
                                <option 
                                  key={p.id_semestre} 
                                  value={p.semestre}
                                >
                                  {p.semestre}
                                </option>
                              ))}
                          </select>
                      </div>
                  )}
                </div>
                <div id="dashboards">
                  <div id="containerInformacoesDesempenho">
                    <div id="informacoesGerais">
                      <div id="informacoesTitle">
                        <img src={InfoIcon} alt="iconeInfo"/>
                        <label htmlFor="">Informações Gerais</label>
                      </div>
                      <div id="informacoesContent">
                        {generalInfoContent}
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
