import './Ranking.css'
import Sidebar from '../../components/sidebar/Sidebar'
import UserIcon from "../../assets/usuario-icon.png" 

import React, { useState, useEffect } from 'react';

function RankingPage() {
  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [selectedMateria, setSelectedMateria] = useState(null);
  const [selectedTurma, setSelectedTurma] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);

  const [restored, setRestored] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);
  const [filtersJSON, setFiltersJSON] = useState(null);

  const STORAGE_KEY = "rankingFilters";
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

  // --- 2️⃣ Restaurar filtros salvos ---
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedFilters) {
      setSelectedMateria(savedFilters.materia || null);
      setSelectedTurma(savedFilters.turma || null);
      setSelectedPeriodo(savedFilters.periodo || null);
      console.log("🧩 Filtros de ranking restaurados:", savedFilters);
    }
    setRestored(true);
  }, []);

  // --- 3️⃣ Salvar filtros no localStorage ---
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
      console.log("✅ Filtros do ranking prontos:", json);
    } else {
      setFiltersJSON(null);
      setFiltersReady(false);
    }
  }, [selectedMateria, selectedTurma, selectedPeriodo, userLevel]);

  // --- Helper: mostrar quais filtros são visíveis ---
  const getVisibleFilters = (nivel) => {
    switch (nivel) {
      case 'aluno': return { materia: true, periodo: true, turma: false };
      case 'professor': return { materia: false, periodo: true, turma: true };
      case 'gestão': return { materia: true, periodo: true, turma: true };
      default: return {};
    }
  };

  const visibleFilters = getVisibleFilters(userLevel);

  return (
    <div id="telaRanking">
      <Sidebar />

        <div id="containerRanking">
            <h1 id='title'>Ranking d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: <strong>{dataUser.nome}</strong></h1>
            <hr />

            <div id="usuarioContainer">
                <img src={UserIcon} alt="Usuário" />
                <div id="userContent">
                    <h1>{dataUser.nome}</h1>
                    {dataUser.turma?.turma && <span>{dataUser.turma.turma}</span>}
                </div>
            </div>

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
                            <option value="">Selecione a turma</option>
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

            <table id='tabelaRanking'>
                <thead id='tabelaHeaderContainer'>
                    <tr id='tabelaHeader'>
                        <th id='rankingHeader'>Ranking</th>
                        <th id='mediaHeader'>Média</th>
                        <th id='nomeHeader'>Nome do aluno</th>
                    </tr>
                </thead>
                <tbody id='tabelaBody'>
                    <tr className='tabelaLinha'>
                        <td className='tabelaRanking'>1°</td>
                        <td className='tabelaMedia'>10.0</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                    <tr className='tabelaLinhaUncensored'>
                        <td className='tabelaRanking'>2°</td>
                        <td className='tabelaMedia'>9.0</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                    <tr className='tabelaLinha'>
                        <td className='tabelaRanking'>3°</td>
                        <td className='tabelaMedia'>8.7</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                    <tr className='tabelaLinha'>
                        <td className='tabelaRanking'>4°</td>
                        <td className='tabelaMedia'>8.2</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                    <tr className='tabelaLinha'>
                        <td className='tabelaRanking'>5°</td>
                        <td className='tabelaMedia'>7.9</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                    <tr className='tabelaLinha'>
                        <td className='tabelaRanking'>6°</td>
                        <td className='tabelaMedia'>7.3</td>
                        <td className='tabelaNome'>João Victor Campos dos Santos</td>
                    </tr>
                </tbody>
            </table>


            {/* {filtersReady && (
            <div className="mensagem">
                <p>✅ Filtros prontos, pode carregar o ranking...</p>
                <pre>{JSON.stringify(filtersJSON, null, 2)}</pre>
            </div>
            )} */}

        </div>
    </div>
  )
}

export default RankingPage;
