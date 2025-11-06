import './Dashboards.css'
import Sidebar from '../../components/sidebar/Sidebar'

import UserIcon from "../../assets/usuario-icon.png"

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx'; // Importa o hook

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

  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState(null);

  const dataUser = JSON.parse(localStorage.getItem("userData"));
  const userLevel = dataUser.nivel_usuario;

  const { isDarkMode } = useTheme();  

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

  useEffect(() => {
    setInsights(null);
    setInsightsError(null);
  }, [selectedMateria, selectedTurma, selectedPeriodo]);

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
      switch (userLevel) {
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

        if (data?.desempenho?.length > 0) {
          const materiaAtual = data.desempenho[0].materia?.id_materia || filtersJSON.materia;
          const semestreAtual = filtersJSON.periodo;
          const perfilAtual = filtersJSON.id_perfil;

          const dashboardIDs = {
            id_perfil: perfilAtual,
            id_materia: materiaAtual,
            id_semestre: semestreAtual,
            data_dashboard: data.desempenho
          };

          console.log("📊 Dashboard carregado com sucesso! IDs atuais:", dashboardIDs);

          sendDashboardToAI(dashboardIDs);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardForUser();
  }, [filtersReady, filtersJSON, userLevel]);

  const sendDashboardToAI = async (dashboardIDs) => {

    setIsLoadingInsights(true);
    setInsightsError(null);

    try {
      let aiEndpoint = "";

      // 🔹 Define o endpoint correto com base no nível do usuário
      switch (userLevel) {
        case "aluno":
          aiEndpoint = `http://localhost:8080/v1/analytica-ai/insights/aluno?materia=${dashboardIDs.id_materia}&semestre=${dashboardIDs.id_semestre}`;
          break;
        case "professor":
          aiEndpoint = `http://localhost:8080/v1/analytica-ai/insights/professor?materia=${dashboardIDs.id_materia}&semestre=${dashboardIDs.id_semestre}`;
          break;
        case "gestão":
          aiEndpoint = `http://localhost:8080/v1/analytica-ai/insights/gestao?materia=${dashboardIDs.id_materia}&semestre=${dashboardIDs.id_semestre}`;
          break;
        default:
          console.error("❌ Nível de usuário inválido para envio à IA.");
          return;
      }

      // 🔹 Faz o POST com os dados do dashboard
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desempenho: dashboardIDs.data_dashboard,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar para IA: ${response.status}`);
      }

      const aiResponse = await response.json();
      console.log("🤖 Resposta da IA:", aiResponse);
      setInsights(aiResponse?.insight || []);
    } catch (error) {
      setInsightsError("Erro ao gerar insights. Tente novamente mais tarde.");
      console.error("❌ Erro ao enviar dados para IA:", error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

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
      legend: { display: false, labels: {color: isDarkMode ? "#fff" : "#000" }},
      datalabels: {
        display: exibirLabels,
        anchor: "end",
        align: "top",
        color: isDarkMode ? "#fff" : "#000",
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
      x: { ticks: { display: exibirLabels, color: isDarkMode ? "#fff" : "#000", barPercentage: 0.2, categoryPercentage: 0.5 } },
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
          borderColor: isDarkMode ? ["rgba(29, 29, 29, 1)"] : ["rgba(255, 255, 255, 1)"],
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
      <Sidebar />
      <div id="containerDashboards">
        <h1 id='title'>Dashboard d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: <strong>{dataUser.nome}</strong></h1>
        <hr />
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
                <img src={InfoIcon} alt="iconeInfo" />
                <label>Informações Gerais</label>
              </div>
              <div id="informacoesContent">{generalInfoContent}</div>
            </div>
            <div id="desempenho">
              <div id="desempenhoTitle">
                <img src={CheckIcon} alt="iconeDesempenho" />
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
              <img src={ChartICon} alt="iconeChart" />
              <label>Frequência no Período</label>
            </div>
            <div id="graficoContainer">
              <div id="grafico"><Pie data={pieChartData} options={optionsPizza} /></div>
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
              <img src={PerformIcon} alt="iconePerform" />
              <label>
                {dashboardData
                  ? `Desempenho em ${dashboardData.desempenho[0].materia.materia}`
                  : '-'
                }
              </label>
            </div>
            <div id="graficoBarra"><Bar data={barChartData} options={optionsBarra} /></div>
          </div>
        </div>

        <hr />

        {/* Insights */}
        <div id="containerInsights">
          <div id="headerInsights">
            <img src={relatoriosIcon} alt="" />
            <h1>Relatórios e Insights por Matéria</h1>
          </div>

          <div id="insightsContainer">
            {isLoadingInsights && (
              <div className="insight">
                <h2>Carregando insight...</h2>
                <h3></h3>
                <span>...</span>
              </div>
            )}

            {insightsError && (
              <div className="insight">
                <h2>Erro ao gerar insight</h2>
                <h3>00/00/0000</h3>
                <span>Não foi possível gerar os insights</span>
              </div>
            )}

            {!isLoadingInsights && !insightsError && (
              <>
                {Array.isArray(insights) && insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div className="insight" key={index}>
                      <h2>{insight.titulo || `Insight ${index + 1}`}</h2>
                      <h3>{insight.data || "00/00/0000"}</h3>
                      <span>{insight.conteudo || "⚠️ Nenhum insight disponível para esses filtros."}</span>
                    </div>
                  ))
                ) : insights && insights.titulo ? (
                  <div className="insight">
                    <h2>{insights.titulo}</h2>
                    <h3>{insights.data || "00/00/0000"}</h3>
                    <span>{insights.conteudo}</span>
                  </div>
                ) : (
                  <div className="insight">
                    <h2>Sem insights</h2>
                    <h3></h3>
                    <span>Não foi possível gerar os insights para os filtros selecionados</span>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardsPage;
