import React, { useEffect, useState } from 'react';
import './RecursosCriar.css';
import Sidebar from '../../components/sidebar/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

const RightSidebar = ({
  materias,
  periodos,
  turmas,
  idMateria,
  setIdMateria,
  idTurma,
  setIdTurma,
  idSemestre,
  setIdSemestre,
  isEditMode,
  setIsEditMode,
  isSaving,
  isDeleting,
  onSubmit,
  onDelete,
  recurso,
}) => {
  const getTurmaNome = () => {
    const turma = turmas.find((t) => String(t.id_turma) === String(idTurma));
    return turma ? turma.turma : '';
  };

  const getSemestreNome = () => {
    const semestre = periodos.find(
      (s) => String(s.id_semestre) === String(idSemestre)
    );
    return semestre ? semestre.semestre : '';
  };

  const getMateriaNome = () => {
    if (recurso?.materia) return recurso.materia;
    const materia = materias.find(
      (m) => String(m.id_materia) === String(idMateria)
    );
    return materia ? materia.materia : '';
  };

  const canSubmit = !!idTurma && !!idSemestre && !!idMateria;

  return (
    <aside id="sidebarDireita">
      <div className="cabecalho-sidebar">
        <h2>Atribuir a</h2>
        {recurso && (
          <button
            type="button"
            className="btn-editar"
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            ✎ Editar
          </button>
        )}
      </div>

      <div className="atribuicao-campos">
        <div className="campo">
          <label htmlFor="turma">Turma</label>
          {idTurma && getTurmaNome() && !isEditMode ? (
            <span>{getTurmaNome()}</span>
          ) : (
            <select
              id="turma"
              value={idTurma || ''}
              onChange={(e) => setIdTurma(e.target.value || null)}
            >
              <option value="">Selecione</option>
              {turmas.map((t) => (
                <option key={t.id_turma} value={t.id_turma}>
                  {t.turma}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="campo">
          <label htmlFor="periodo">Período</label>
          {idSemestre && getSemestreNome() && !isEditMode ? (
            <span>{getSemestreNome()}</span>
          ) : (
            <select
              id="periodo"
              value={idSemestre || ''}
              onChange={(e) => setIdSemestre(e.target.value || null)}
            >
              <option value="">Selecione</option>
              {periodos.map((p) => (
                <option key={p.id_semestre} value={p.id_semestre}>
                  {p.semestre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="campo">
          <label htmlFor="materia">Matéria</label>
          {recurso && !isEditMode && getMateriaNome() ? (
            <span>{getMateriaNome()}</span>
          ) : (
            <select
              id="materia"
              value={idMateria || ''}
              onChange={(e) => setIdMateria(e.target.value || null)}
            >
              <option value="">Selecione</option>
              {materias.map((m) => (
                <option key={m.id_materia} value={m.id_materia}>
                  {m.materia}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <button
        type="button"
        className="btn-criar"
        onClick={onSubmit}
        disabled={!isEditMode || isSaving || !canSubmit}
      >
        {isSaving ? 'Salvando...' : recurso ? 'Salvar Recurso' : 'Criar Recurso'}
      </button>

      {recurso && (
        <button
          type="button"
          className="btn-excluir"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Excluindo...' : 'Excluir Recurso'}
        </button>
      )}
    </aside>
  );
};

function RecursosCriarPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const dataUser = JSON.parse(localStorage.getItem('userData'));
  const userLevel = dataUser?.nivel_usuario;
  const isProfessor = userLevel === 'professor';

  const recurso = state?.recurso || null;
  const filters = state?.filters || {};

  const [titulo, setTitulo] = useState(recurso?.titulo || '');
  const [descricao, setDescricao] = useState(recurso?.descricao || '');
  const [link, setLink] = useState(recurso?.link_criterio || '');
  const [dataCriacao] = useState(
    recurso?.data_criacao
      ? recurso.data_criacao.substring(0, 10)
      : new Date().toISOString().substring(0, 10)
  );

  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [idMateria, setIdMateria] = useState(
    recurso?.id_materia || filters.materia || null
  );
  const [idTurma, setIdTurma] = useState(
    recurso?.id_turma || filters.turma || null
  );
  const [idSemestre, setIdSemestre] = useState(
    recurso?.id_semestre || filters.periodo || null
  );

  const [isEditMode, setIsEditMode] = useState(!recurso);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Garante que só professor acesse
  useEffect(() => {
    if (!isProfessor) {
      navigate('/recursos');
    }
  }, [isProfessor, navigate]);

  const fetchData = async (endpoint, dataKey) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data[dataKey] || [];
    } catch (err) {
      console.error(`Erro ao buscar ${endpoint}:`, err);
      return [];
    }
  };

  // Carrega listas de matéria / turma / semestre
  useEffect(() => {
    const loadLists = async () => {
      const [mats, turs, sems] = await Promise.all([
        fetchData('http://localhost:8080/v1/analytica-ai/materia', 'materias'),
        fetchData('http://localhost:8080/v1/analytica-ai/turma', 'turmas'),
        fetchData('http://localhost:8080/v1/analytica-ai/semestre', 'semestres'),
      ]);
      setMaterias(mats);
      setTurmas(turs);
      setPeriodos(sems);
    };

    loadLists();
  }, []);

  const validate = () => {
    if (!titulo || !descricao || !link) {
      setError('Preencha título, descrição e link do recurso.');
      return false;
    }
    if (!idTurma || !idSemestre || !idMateria) {
      setError('Selecione Turma, Período e Matéria.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!isEditMode) return;
    if (!validate()) return;

    setIsSaving(true);
    setSuccess(null);

    const payload = {
      titulo,
      descricao,
      link_criterio: link,
      data_criacao: dataCriacao,
      id_materia: Number(idMateria),
      id_professor: dataUser.id_perfil,
      id_turma: Number(idTurma),
      id_semestre: Number(idSemestre),
    };

    try {
      // Ajuste aqui se o seu back usar outro path (ex: id_recursos em vez de id_professor)
      const url = `http://localhost:8080/v1/analytica-ai/recurso`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.status !== true) {
        throw new Error(data.message || 'Erro ao salvar recurso');
      }

      setSuccess(data.message || 'Recurso salvo com sucesso.');
    } catch (err) {
      console.error('Erro ao salvar recurso:', err);
      setError('Não foi possível salvar o recurso. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recurso) return;
    const confirmado = window.confirm(
      'Tem certeza que deseja excluir este recurso?'
    );
    if (!confirmado) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const url = `http://localhost:8080/v1/analytica-ai/recurso/${recurso.id_recursos}`;
      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === false) {
        throw new Error(data.message || 'Erro ao excluir recurso');
      }

      navigate('/recursos');
    } catch (err) {
      console.error('Erro ao excluir recurso:', err);
      setError('Não foi possível excluir o recurso. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    navigate('/recursos');
  };

  return (
    <>
      <div id="telaRecursos">
        <div id="containerRecursos">
          <div className="conteudo-recursos">
            <div className="cabecalho-recursos">
              <div className="titulo-com-linha">
                <h1>{recurso ? 'Recurso - Detalhes' : 'Criar Recurso'}</h1>
                <div className="linha-titulo"></div>
              </div>
            </div>

            <form
              className="formulario-recursos"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="campo">
                <label htmlFor="titulo">Título</label>
                <input
                  type="text"
                  id="titulo"
                  placeholder="Título do recurso..."
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="instrucoes">Descrição</label>
                <textarea
                  id="instrucoes"
                  rows="5"
                  placeholder="Descreva brevemente o recurso..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  disabled={!isEditMode}
                  required
                ></textarea>
              </div>

              <div className="campo">
                <label htmlFor="link">Link do recurso</label>
                <input
                  type="text"
                  id="link"
                  placeholder="Cole aqui o link do vídeo, documento ou material..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={!isEditMode}
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="dataCriacao">Data de criação</label>
                <input
                  type="date"
                  id="dataCriacao"
                  value={dataCriacao}
                  disabled
                />
              </div>

              {error && <span className="mensagem-erro">{error}</span>}
              {success && <span className="mensagem-sucesso">{success}</span>}

              <button
                type="button"
                className="btn-voltar"
                onClick={handleBack}
              >
                Voltar
              </button>
            </form>
          </div>
        </div>

        <RightSidebar
          materias={materias}
          periodos={periodos}
          turmas={turmas}
          idMateria={idMateria}
          setIdMateria={setIdMateria}
          idTurma={idTurma}
          setIdTurma={setIdTurma}
          idSemestre={idSemestre}
          setIdSemestre={setIdSemestre}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          recurso={recurso}
        />
      </div>
    </>
  );
}

export default RecursosCriarPage;