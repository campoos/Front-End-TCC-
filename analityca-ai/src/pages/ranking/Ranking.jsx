import './Ranking.css' // Seu CSS de Ranking
import Sidebar from '../../components/sidebar/Sidebar'
import UserIcon from "../../assets/usuario-icon.png" 
import { useTheme } from '../../contexts/ThemeContext.jsx'; // Importa o hook

import React, { useState, useEffect } from 'react';

function RankingPage() {
    const { isDarkMode } = useTheme();
    // ESTADOS DE FILTRO (Mantidos)
    const [materias, setMaterias] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    const [selectedMateria, setSelectedMateria] = useState(null);
    const [selectedTurma, setSelectedTurma] = useState(null);
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);

    const [restored, setRestored] = useState(false);
    const [filtersReady, setFiltersReady] = useState(false);
    const [filtersJSON, setFiltersJSON] = useState(null);
    
    // NOVO: Estados para o consumo do Ranking
    const [rankingData, setRankingData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dados do Usuário (Mantidos)
    const STORAGE_KEY = "rankingFilters";
    const dataUser = JSON.parse(localStorage.getItem("userData"));
    const userLevel = dataUser.nivel_usuario;
    const userId = dataUser.id_perfil; 

    // --- Função genérica para buscar dados da API (Mantida) ---
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

    // --- Helper: mostrar quais filtros são visíveis (Mantido) ---
    const getVisibleFilters = (nivel) => {
        switch (nivel) {
            case 'aluno': return { materia: true, periodo: true, turma: false };
            case 'professor': return { materia: false, periodo: true, turma: true };
            case 'gestão': return { materia: true, periodo: true, turma: true };
            default: return {};
        }
    };
    const visibleFilters = getVisibleFilters(userLevel);

    // [LÓGICA DE USEEFFECTS MANTIDA] 
    // 1️⃣ Carregar filtros da API
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

    // 2️⃣ Restaurar filtros salvos
    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (savedFilters) {
            setSelectedMateria(savedFilters.materia || null);
            setSelectedTurma(savedFilters.turma || null);
            setSelectedPeriodo(savedFilters.periodo || null);
        }
        setRestored(true);
    }, []);

    // 3️⃣ Salvar filtros no localStorage
    useEffect(() => {
        if (!restored) return;

        const filters = {
            materia: selectedMateria,
            turma: selectedTurma,
            periodo: selectedPeriodo,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }, [selectedMateria, selectedTurma, selectedPeriodo, restored]);

    // 4️⃣ Verificar e Montar o JSON de Filtros
    useEffect(() => {
        if (!userLevel) return;

        const required = getVisibleFilters(userLevel);
        const allSelected =
            (!required.materia || selectedMateria !== null) &&
            (!required.turma || selectedTurma !== null) &&
            (!required.periodo || selectedPeriodo !== null);

        if (allSelected && userId) {
            const json = {
                id_perfil: userId,
                ...(selectedMateria !== null && { materia: selectedMateria }),
                ...(selectedTurma !== null && { turma: selectedTurma }),
                ...(selectedPeriodo !== null && { periodo: selectedPeriodo }),
            };
            setFiltersJSON(json);
            setFiltersReady(true);
        } else {
            setFiltersJSON(null);
            setFiltersReady(false);
            setRankingData(null); 
        }
    }, [selectedMateria, selectedTurma, selectedPeriodo, userLevel, userId]);

    // 5️⃣ LÓGICA DE CONSUMO DA API DO RANKING (Mantida)
    useEffect(() => {
        if (!filtersReady || !filtersJSON) return;

        const fetchRankingData = async () => {
            let url = '';
            let id = filtersJSON.id_perfil;
            
            let queryParams = [];
            if (filtersJSON.materia) queryParams.push(`materia=${filtersJSON.materia}`);
            if (filtersJSON.turma) queryParams.push(`turma=${filtersJSON.turma}`);
            if (filtersJSON.periodo) queryParams.push(`semestre=${filtersJSON.periodo}`);
            
            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

            switch(userLevel) {
                case 'aluno':
                    if (!filtersJSON.materia || !filtersJSON.periodo) return;
                    url = `http://localhost:8080/v1/analytica-ai/ranking/aluno/${id}${queryString}`;
                    break;
                case 'professor':
                    if (!filtersJSON.turma || !filtersJSON.periodo) return;
                    url = `http://localhost:8080/v1/analytica-ai/ranking/professor/${id}${queryString}`;
                    break;
                case 'gestão':
                    if (!filtersJSON.turma || !filtersJSON.periodo) return;
                    url = `http://localhost:8080/v1/analytica-ai/ranking/gestao/${id}${queryString}`;
                    break;
                default:
                    return;
            }
            
            setLoading(true);
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (response.status === 400) {
                    console.error("Erro 400: Verifique se todos os filtros obrigatórios foram enviados corretamente.");
                    setRankingData(null);
                    return;
                }
                
                if (response.status === 404 || data.ranking?.length === 0) {
                    setRankingData({ ranking: [] }); 
                    return;
                }
                
                if (!response.ok) throw new Error(`Erro ao buscar Ranking: ${response.status}`);
                setRankingData(data);

            } catch (error) {
                console.error("Erro na requisição do Ranking:", error);
                setRankingData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingData();
    }, [filtersReady, filtersJSON, userLevel, userId]);
    
    // --- Função para determinar a classe da linha ---
    const getTableRowClass = (itemNome) => {
        if (itemNome === dataUser.nome) {
            return 'tabelaLinhaUncensored'; 
        }
        if (userLevel === 'aluno') {
            return 'tabelaLinhaCensored'; 
        }
        return 'tabelaLinhaUncensoredOutros'; 
    };

    // --- Renderização (AJUSTADA PARA MANTER O HEADER DA TABELA VISÍVEL) ---
    return (
        <div id="telaRanking">
            <Sidebar />

            <div id="containerRanking">
                {/* Título e HR */}
                <h1 id='title'>Ranking d{userLevel === "gestão" ? "a" : "o"} {userLevel}: <strong>{dataUser.nome}</strong></h1>
                <hr />

                {/* Usuário Container */}
                <div id="usuarioContainer">
                    <img src={UserIcon} alt="Usuário" className={isDarkMode ? "dark" : "notDark"}/>
                    <div id="userContent">
                        <h1>{dataUser.nome}</h1>
                        {dataUser.turma?.turma && <span>{dataUser.turma.turma}</span>}
                    </div>
                </div>

                {/* Filtros (Mantidos) */}
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

                {/* Tabela de Ranking e Mensagens */}
                <div id="ranking-container">
                    
                    {/* Renderiza a tabela se o usuário for carregado. O conteúdo do tbody é condicional. */}
                    <table id='tabelaRanking'>
                        <thead id='tabelaHeaderContainer'>
                            <tr id='tabelaHeader'>
                                <th id='rankingHeader'>Ranking</th>
                                <th id='mediaHeader'>Média</th>
                                <th id='nomeHeader'>Nome do aluno</th>
                            </tr>
                        </thead>
                        <tbody id='tabelaBody'>
                            {/* 1. MENSAGEM: FILTROS INCOMPLETOS */}
                            {!filtersReady && !loading && (
                                <tr className="tabela-mensagem">
                                    <td colSpan="3">
                                        <strong>Selecione todos os filtros necessários</strong> para visualizar o Ranking.
                                    </td>
                                </tr>
                            )}
                            
                            {/* 2. MENSAGEM: CARREGANDO */}
                            {loading && (
                                <tr className="tabela-mensagem">
                                    <td colSpan="3">
                                        ⌛ Carregando Ranking...
                                    </td>
                                </tr>
                            )}

                            {/* 3. MENSAGEM: NENHUM RESULTADO ENCONTRADO */}
                            {filtersReady && !loading && rankingData?.ranking?.length === 0 && (
                                <tr className="tabela-mensagem">
                                    <td colSpan="3">
                                        <strong>Nenhum resultado encontrado</strong> para os filtros selecionados.
                                    </td>
                                </tr>
                            )}

                            {/* 4. DADOS DO RANKING */}
                            {rankingData?.ranking?.length > 0 && (
                                rankingData.ranking.map((item, index) => {
                                    const rowClass = getTableRowClass(item.nome);
                                    const isUncensored = rowClass.includes('Uncensored'); 
                                    
                                    return (
                                        <tr key={index} className={rowClass}>
                                            <td className='tabelaRanking'>{index + 1}°</td>
                                            {/* Usando as classes para o CSS aplicar ou remover o blur */}
                                            <td className={isUncensored ? 'tabelaMediaUncensored' : 'tabelaMediaCensored'}>
                                                {Number(item.Média).toFixed(1)}
                                            </td>
                                            <td className={isUncensored ? 'tabelaNomeUncensored' : 'tabelaNomeCensored'}>
                                                {item.nome}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RankingPage;