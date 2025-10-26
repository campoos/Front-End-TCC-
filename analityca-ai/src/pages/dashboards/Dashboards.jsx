import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png" 

import React, { useState, useEffect } from 'react';

import InfoIcon from "../../assets/dashboards/info-icon.png"
import CheckIcon from "../../assets/dashboards/check-icon.png"
import ChartICon from "../../assets/dashboards/chart-icon.png"
import PerformIcon from "../../assets/dashboards/perform-icon.png"
import relatoriosIcon from "../../assets/dashboards/relatorios-insights-icon.png"

import { Pie, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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

  const [selectedMateria, setSelectedMateria] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);

  const [filtersReady, setFiltersReady] = useState(false);
  const [filtersJSON, setFiltersJSON] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);

  const [restored, setRestored] = useState(false);


  const dataUser = JSON.parse(localStorage.getItem("userData"));
  const userLevel = dataUser.nivel_usuario;

  // --- Função genérica para buscar dados da API ---
  const fetchData = async (endpoint, dataKey) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data[dataKey] || [];
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
      return [];
    }
  };

  const STORAGE_KEY = "dashboardFilters";
  // --- 1️⃣ Carregar filtros da API ---
  useEffect(() => {
    if (!userLevel) return;

    const loadFilters = async () => {
      const visible = getVisibleFilters(userLevel);

      if (visible.materia) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/materia', 'materias');
        setMaterias(data);
      }

      if (visible.turma) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/turma', 'turmas');
        setTurmas(data);
      }

      if (visible.periodo) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/semestre', 'semestres');
        setPeriodos(data);
      }
    };

    loadFilters();
  }, [userLevel]);

  // --- 2️⃣ Restaurar filtros salvos ao carregar a página ---
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedFilters) {
      setSelectedMateria(savedFilters.materia || null);
      setSelectedTurma(savedFilters.turma || null);
      setSelectedPeriodo(savedFilters.periodo || null);
      console.log("🧩 Filtros restaurados do localStorage:", savedFilters);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;

    const filters = {
      materia: selectedMateria,
      turma: selectedTurma,
      periodo: selectedPeriodo,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [selectedMateria, selectedTurma, selectedPeriodo]);

  // --- 4️⃣ Verificar se filtros estão prontos ---
  useEffect(() => {
    if (!userLevel) return;

    const required = getVisibleFilters(userLevel);
    const allSelected =
      (!required.materia || selectedMateria !== null) &&
      (!required.turma || selectedTurma !== null) &&
      (!required.periodo || selectedPeriodo !== null);

    if (allSelected) {
      const json = {
        id_perfil: dataUser.id_perfil,
        ...(required.materia && { materia: selectedMateria }),
        ...(required.turma && { turma: selectedTurma }),
        ...(required.periodo && { periodo: selectedPeriodo }),
      };
      setFiltersJSON(json);
      setFiltersReady(true);
      console.log("✅ Filtros prontos:", json);
    } else {
      setFiltersJSON(null);
      setFiltersReady(false);
    }
  }, [selectedMateria, selectedTurma, selectedPeriodo, userLevel]);

  // --- 3️⃣ Buscar dados do dashboard quando filtros estiverem prontos ---
  useEffect(() => {
    if (!filtersReady || !filtersJSON) return;

    const fetchDashboardForUser = async () => {
      let url = '';
      switch(userLevel) {
        case 'aluno':
          url = `http://localhost:8080/v1/analytica-ai/desempenho/aluno/${filtersJSON.id_perfil}?materia=${filtersJSON.materia}&semestre=${filtersJSON.periodo}`;
          break;
        case 'professor':
          url = `http://localhost:8080/v1/analytica-ai/desempenho/turma/${filtersJSON.id_perfil}?turma=${filtersJSON.turma}&semestre=${filtersJSON.periodo}`;
          break;
        case 'gestão':
          url = `http://localhost:8080/v1/analytica-ai/desempenho/gestao/turma-materia/${filtersJSON.id_perfil}?turma=${filtersJSON.turma}&materia=${filtersJSON.materia}&semestre=${filtersJSON.periodo}`;
          break;
        default:
          console.log('Nível de usuário desconhecido');
          return;
      }

      try {
        const response = await fetch(url);

        if (response.status === 404) {
          console.warn("Nenhum dado encontrado para os filtros selecionados (404)");
          setDashboardData(null);
          return;
        }
        
        if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.status}`);
        const data = await response.json();
        setDashboardData(data);
        console.log('✅ Dados do dashboard:', data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardForUser();
  }, [filtersReady, filtersJSON, userLevel]);

  // --- Helpers ---
  const getVisibleFilters = (nivel) => {
    switch (nivel) {
      case 'aluno': return { materia: true, periodo: true, turma: false };
      case 'professor': return { materia: false, periodo: true, turma: true };
      case 'gestão': return { materia: true, periodo: true, turma: true };
      default: return {};
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
          <span key="nome">Nome Completo: {user.nome}</span>,
          <span key="email">Email: {user.email}</span>,
          <span key="contato">Contato: {user.telefone}</span>
        );
        break;
    }
    return info;
  };

  const generalInfoContent = getGeneralInfoContent(dataUser);
  const visibleFilters = getVisibleFilters(userLevel);

  // --- Dados dos gráficos ---
  const emptyPieData = { labels: ["Presença", "Falta"], datasets: [{ data: [80, 20], backgroundColor: ["#d3d3d3", "#b5b5b5"], borderWidth: 2 }] };
  const emptyBarData = { labels: ["-", "-", "-", "-"], datasets: [{ data: [0, 0, 0, 0], backgroundColor: "#b5b5b5", borderRadius: 2, barPercentage: 0.7, categoryPercentage: 0.6 }] };

  const optionsPizza = { plugins: { legend: { display: false }, datalabels: { display: false } } };
  
  const atividades = dashboardData?.desempenho?.[0]?.atividades || [];

  console.log(atividades)
  const exibirLabels = atividades.length <= 10; // até 10 atividades mostra labels
    
  const optionsBarra = {
    maintainAspectRatio: false,
    responsive: true,
    layout: { padding: { top: 23 } },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: exibirLabels,
        anchor: "end",
        align: "top",
        color: "#000",
        font: { weight: "thin", size: 14 },
        formatter: (v) => v.toFixed(1),
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const atividade = dashboardData?.desempenho[0]?.atividades[index];
            const nota = atividade?.nota ?? "-";
            const categoria = atividade?.categoria || "Sem categoria disponível";
            const descricao = atividade?.descricao || "Sem descricao disponível";
            return [
              `Atividade: ${atividade?.atividade || "—"}`,
              `Nota: ${nota}`,
              `Categoria: ${categoria}`,
              `Descricao: ${descricao}`
            ];
          },
        },
      },
    },
    scales: {
      x: {ticks: {display:exibirLabels, color: "#000" , barPercentage: 0.2, categoryPercentage: 0.5 }},
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  console.log(dashboardData)

  const pieChartData = dashboardData
  ? {
      labels: ["Presença", "Falta"],
      datasets: [
        {
          data: [
            Number(dashboardData.desempenho[0].frequencia.presencas),
            Number(dashboardData.desempenho[0].frequencia.faltas)
          ],
          backgroundColor: ["rgb(222, 212, 252)", "rgb(125, 83, 243)"],
          borderColor: ["rgba(255, 255, 255, 1)"],
          borderWidth: 4
        }
      ]
    }
  : emptyPieData;

  const barChartData = dashboardData
  ? {
      labels: atividades.map(a => a.categoria),
      datasets: [
        {
          label: "Notas",
          data: dashboardData.desempenho[0].atividades.map(a => a.nota),
          backgroundColor: "rgb(125, 83, 243)",
          borderRadius: 2,
          barPercentage: 0.7,
          categoryPercentage: 0.6
        }
      ]
    }
  : emptyBarData;


  return (
    <div id="telaDashboards">
      <Sidebar/>
      <div id="containerDashboards">
        <h1 id='title'>Dashboard d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: <strong>{dataUser.nome}</strong></h1>
        <hr/>
        <div id="usuarioContainer">
          <img src={UserIcon} alt="" />
          <div id="userContent">
            <h1>{dataUser.nome}</h1>
            {dataUser.turma?.turma && <span>{dataUser.turma.turma}</span>}
          </div>
        </div>

        {/* Filtros */}
        <div id="filtros">
          {visibleFilters.materia && (
            <div className="filtro">
              <label htmlFor="disciplina">Disciplina:</label>
              <select id="disciplina" value={selectedMateria || ""} onChange={(e) => setSelectedMateria(e.target.value || null)}>
                <option value="">Selecione a disciplina</option>
                {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.materia}</option>)}
              </select>
            </div>
          )}
          {visibleFilters.turma && (
            <div className="filtro">
              <label htmlFor="turma">Turma:</label>
              <select id="turma" value={selectedTurma || ""} onChange={(e) => setSelectedTurma(e.target.value || null)}>
                <option value="">Seleciona a turma</option>
                {turmas.map(t => <option key={t.id_turma} value={t.id_turma}>{t.turma}</option>)}
              </select>
            </div>
          )}
          {visibleFilters.periodo && (
            <div className="filtro">
              <label htmlFor="periodo">Período:</label>
              <select id="periodo" value={selectedPeriodo || ""} onChange={(e) => setSelectedPeriodo(e.target.value || null)}>
                <option value="">Selecione o período</option>
                {periodos.map(p => <option key={p.id_semestre} value={p.id_semestre}>{p.semestre}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Dashboards */}
        <div id="dashboards">
          {/* Informações e Desempenho */}
          <div id="containerInformacoesDesempenho">
            <div id="informacoesGerais">
              <div id="informacoesTitle">
                <img src={InfoIcon} alt="iconeInfo"/>
                <label>Informações Gerais</label>
              </div>
              <div id="informacoesContent">{generalInfoContent}</div>
            </div>
            <div id="desempenho">
              <div id="desempenhoTitle">
                <img src={CheckIcon} alt="iconeDesempenho"/>
                <label>Desempenho na Matéria</label>
              </div>
              <div id="informacoesContent">
                <div id="notaMedia">
                  <h1>
                    {dashboardData 
                      ? parseFloat(dashboardData.desempenho[0].media).toFixed(1)
                      : '-'
                    }
                  </h1>
                  <h2>
                     {dashboardData 
                      ? "▪"
                      : ''
                    }
                  </h2>
     
                  {dashboardData 
                    ? <span>Média do Semestre</span>
                    : <p>Média não disponível</p>
                  }
                </div>
              </div>
              <h4>
                {dashboardData 
                  ? `Nota de ${dashboardData.desempenho[0].materia.materia}`
                  : ''
                }
              </h4>
            </div>
          </div>

          {/* Frequência */}
          <div id="frequencia">
            <div id="frequenciaTitle">
              <img src={ChartICon} alt="iconeChart"/>
              <label>Frequência no Período</label>
            </div>
            <div id="graficoContainer">
              <div id="grafico"><Pie data={pieChartData} options={optionsPizza}/></div>
              <div id="textoGrafico">
                <h1>
                  {dashboardData
                    ? `${dashboardData.desempenho[0].frequencia.porcentagem_frequencia}`
                    : '-'
                  }
                </h1>
                <label>Frequência</label>
              </div>
            </div>
            <div id="labelsFrequencia">
              <div id="labelPresenca" className='label'>
                {dashboardData
                    ? <div id="circlePresenca"></div>
                    : <div id="circlePresencaInativo"></div>
                  }
                <span> Total de presenças </span>
              </div>
              <div id="labelFalta" className='label'>
                {dashboardData
                  ? <div id="circleFalta"></div>
                  : <div id="circleFaltaInativo"></div>
                }
                <span> Total de faltas </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div id="notas">
            <div id="notasTitle">
              <img src={PerformIcon} alt="iconePerform"/>
              <label> 
                  {dashboardData
                    ? `Desempenho em ${dashboardData.desempenho[0].materia.materia}` 
                    : '-'
                  }
              </label>
            </div>
            <div id="graficoBarra"><Bar data={barChartData} options={optionsBarra}/></div>
          </div>
        </div>

        <hr/>

        {/* Insights */}
        <div id="containerInsights">
          <div id="headerInsights">
            <img src={relatoriosIcon} alt="" />
            <h1>Relatórios e Insights por Matéria</h1>
          </div>
          <div id="insightsContainer">
            <div className="insight">
              <h2>Avaliação de matemática</h2>
              <h3>01/06/2025</h3>
              <span>Com excelente compreensão de álgebra e geometria...</span>
            </div>
            <div className="insight">
              <h2>Seminário de Matemática</h2>
              <h3>26/06/2025</h3>
              <span>As notas de prova indicam grande domínio...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardsPage;
