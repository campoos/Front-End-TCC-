import './Recursos.css'
import Sidebar from '../../components/sidebar/Sidebar'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RecursosPage() {

  const dataUser = JSON.parse(localStorage.getItem("userData"))
  const userLevel = dataUser?.nivel_usuario
  const userId = dataUser?.id_perfil

  const [materias, setMaterias] = useState([])
  const [turmas, setTurmas] = useState([])
  const [periodos, setPeriodos] = useState([])

  const [selectedMateria, setSelectedMateria] = useState(null)
  const [selectedTurma, setSelectedTurma] = useState(null)
  const [selectedPeriodo, setSelectedPeriodo] = useState(null)

  const [restored, setRestored] = useState(false)
  const [filtersReady, setFiltersReady] = useState(false)
  const [filtersJSON, setFiltersJSON] = useState(null)

  const [recursos, setRecursos] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const fetchData = async (endpoint, dataKey) => {
    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      return data[dataKey] || []
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error)
      return []
    }
  }

  const getVisibleFilters = (nivel) => {
    switch (nivel) {
      case 'aluno': return { materia: true, periodo: true, turma: false }
      case 'professor': return { materia: false, periodo: true, turma: true }
      case 'gestão': return { materia: true, periodo: true, turma: true }
      default: return {}
    }
  }

  const visibleFilters = getVisibleFilters(userLevel)
  const STORAGE_KEY = "recursosFilters"

  useEffect(() => {
    if (!userLevel) return

    const loadFilters = async () => {
      const visible = getVisibleFilters(userLevel)

      if (visible.materia) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/materia', 'materias')
        setMaterias(data)
      }

      if (visible.turma) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/turma', 'turmas')
        setTurmas(data)
      }

      if (visible.periodo) {
        const data = await fetchData('http://localhost:8080/v1/analytica-ai/semestre', 'semestres')
        setPeriodos(data)
      }
    }

    loadFilters()
  }, [userLevel])

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (savedFilters) {
      setSelectedMateria(savedFilters.materia || null)
      setSelectedTurma(savedFilters.turma || null)
      setSelectedPeriodo(savedFilters.periodo || null)
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return

    const filters = {
      materia: selectedMateria,
      turma: selectedTurma,
      periodo: selectedPeriodo
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }, [selectedMateria, selectedTurma, selectedPeriodo, restored])

  useEffect(() => {
    if (!userLevel) return

    const required = getVisibleFilters(userLevel)
    const allSelected =
      (!required.materia || selectedMateria !== null) &&
      (!required.turma || selectedTurma !== null) &&
      (!required.periodo || selectedPeriodo !== null)

    if (allSelected && userId) {
      const json = {
        id_perfil: userId,
        ...(selectedMateria !== null && { materia: selectedMateria }),
        ...(selectedTurma !== null && { turma: selectedTurma }),
        ...(selectedPeriodo !== null && { periodo: selectedPeriodo })
      }
      setFiltersJSON(json)
      setFiltersReady(true)
    } else {
      setFiltersJSON(null)
      setFiltersReady(false)
      setRecursos(null)
    }
  }, [selectedMateria, selectedTurma, selectedPeriodo, userLevel, userId])

  useEffect(() => {
    if (!filtersReady || !filtersJSON) return

    const fetchRecursos = async () => {
      let url = ''
      const id = filtersJSON.id_perfil
      let queryParams = []

      if (filtersJSON.materia) queryParams.push(`materia=${filtersJSON.materia}`)
      if (filtersJSON.turma) queryParams.push(`turma=${filtersJSON.turma}`)
      if (filtersJSON.periodo) queryParams.push(`semestre=${filtersJSON.periodo}`)

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''

      switch (userLevel) {
        case 'aluno':
          if (!filtersJSON.materia || !filtersJSON.periodo) return
          url = `http://localhost:8080/v1/analytica-ai/recurso/aluno/${id}${queryString}`
          break
        case 'professor':
          if (!filtersJSON.turma || !filtersJSON.periodo) return
          url = `http://localhost:8080/v1/analytica-ai/recurso/professor/${id}${queryString}`
          break
        case 'gestão':
          if (!filtersJSON.turma || !filtersJSON.periodo || !filtersJSON.materia) return
          url = `http://localhost:8080/v1/analytica-ai/recurso/gestao/${id}${queryString}`
          break
        default:
          return
      }

      setLoading(true)
      try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.status === 404 || data.recursos?.length === 0) {
          setRecursos([])
          return
        }

        if (!response.ok) throw new Error(`Erro ao buscar Recursos: ${response.status}`)
        setRecursos(data.recursos || [])
      } catch (error) {
        console.error("Erro na requisição de Recursos:", error)
        setRecursos(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecursos()
  }, [filtersReady, filtersJSON, userLevel])

  const handleCreateClick = () => {
    const filters = {
      materia: selectedMateria,
      turma: selectedTurma,
      periodo: selectedPeriodo
    }
    navigate('/recursos-criar', { state: { filters } })
  }

  const handleCardClick = (recurso) => {
    if (userLevel !== 'professor') return
    const filters = {
      materia: selectedMateria,
      turma: selectedTurma,
      periodo: selectedPeriodo
    }
    navigate('/recursos-criar', { state: { recurso, filters } })
  }

  const renderMensagem = () => {
    if (!filtersReady && !loading) {
      return (
        <div className="mensagemRecursos">
          <h2>Selecione todos os filtros necessários</h2>
          <span>Assim podemos buscar os recursos corretos para você.</span>
        </div>
      )
    }

    if (loading) {
      return (
        <div className="mensagemRecursos">
          <h2>Carregando recursos...</h2>
        </div>
      )
    }

    if (filtersReady && !loading && Array.isArray(recursos) && recursos.length === 0) {
      return (
        <div className="mensagemRecursos">
          <h2>Nenhum recurso encontrado</h2>
          <span>Ajuste os filtros ou aguarde novos materiais.</span>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <div id="telaRecursosHome">
        <Sidebar />
        <div id="containerRecursosHome">
          <div id="containerTexto">
            <h1 id='title'>Recursos d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: {dataUser.nome}</h1>
            <hr />
          </div>

          <div id="headerRecursos">
            <div id="filtrosRecursos">
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

            {userLevel === 'professor' && (
              <button id="btnCriarRecurso" type="button" onClick={handleCreateClick}>
                + Criar
              </button>
            )}
          </div>

          <div id="cardsRecursosContainer">
            {renderMensagem()}

            {Array.isArray(recursos) && recursos.length > 0 && recursos.map((recurso) => (
              <div
                key={recurso.id_recursos}
                className="recursoCard"
                onClick={() => handleCardClick(recurso)}
              >
                <div className="recursoCardHeader">
                  <h2>{recurso.titulo}</h2>
                  <div className="recursoStatusDot"></div>
                </div>
                <p className="recursoDescricao">{recurso.descricao}</p>
                <div className="recursoMeta">
                  {recurso.materia && <span>{recurso.materia}</span>}
                  {recurso.semestre && <span>{recurso.semestre}</span>}
                </div>
                <div className="recursoLinkContainer">
                  <button
                    className="recursoLinkButton"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (recurso.link_criterio) {
                        window.open(recurso.link_criterio, '_blank')
                      }
                    }}
                  >
                    Acessar recurso
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default RecursosPage;
