import './Configuracoes.css'
import Sidebar from '../../components/sidebar/Sidebar'
import iconUser from '../../assets/configuracoes-icons/user-icon.png'
import iconEmail from '../../assets/configuracoes-icons/email-icon.png'
import iconPhone from '../../assets/configuracoes-icons/phone-icon.png'

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const FundoEscuro = ({ show }) => {
  if (!show) return null;
  return (<div id="fundoEscuro"></div>);
};

const ModalConfirmacaoLogout = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div id="modalContainer">
      <div id="modalContent">
        <h3>Confirmar Saída</h3>
        <p>Você tem certeza que deseja <strong>sair da sua conta?</strong> Dados não salvos e preferências temporárias armazenadas neste navegador serão perdidas.</p>
        <div id="modalOptions">
          <button onClick={onCancel} id="buttonCancelar">Cancelar</button>
          <button onClick={onConfirm} id="buttonConfirmar">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

function ConfiguracoesPage() {

  const { isDarkMode, toggleDarkMode } = useTheme();

  const navigate = useNavigate();
  const dataUser = JSON.parse(localStorage.getItem("userData"))

  const [formData, setFormData] = useState({
    nome: dataUser.nome || "",
    email: dataUser.email || "",
    telefone: dataUser.telefone || ""
  });

  const [isModified, setIsModified] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const className = 'no-scroll-global';
    if (showLogoutModal) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }

    return () => {
      document.documentElement.classList.remove(className);
    };
  }, [showLogoutModal]);

  const executeLogout = () => {
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");
    localStorage.removeItem("lembrarCredencial");
    localStorage.removeItem("dashboardFilters");
    localStorage.removeItem("rankingFilters");
    navigate("/login");
  };

  const handleOpenLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => {
    executeLogout();
    handleCloseLogoutModal();
  };

  // Detecta se houve mudanças
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const modified =
        updated.nome !== dataUser.nome ||
        updated.email !== dataUser.email ||
        updated.telefone !== dataUser.telefone;
      setIsModified(modified);
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      let endpointBase = "http://localhost:8080/v1/analytica-ai";
      const nivel = dataUser.nivel_usuario.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); ;
      const idPerfil = dataUser.id_perfil;
      const endpoint = `${endpointBase}/${nivel}/${idPerfil}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const message = response.status === 400 
          ? "Campos obrigatórios não atendem os requerimentos" 
          : "Erro ao salvar as alterações.";
        throw new Error(message);
      }

      const result = await response.json();

      // Atualiza localStorage com novos dados
      const updatedUser = { ...dataUser, ...formData };
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Alterações salvas com sucesso!");
      setIsModified(false);

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <div id="telaConfiguracoes">
        <Sidebar />
        <div id="containerConfiguracoes">
          <div id="containerTexto">
             <h1 id='title'>Configurações d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: {dataUser.nome}</h1>
            <span id='desc'>Gerencie suas informações e preferências do sistema</span>
          </div>

          <div id='configuracoes'>
            <div id='containerInformacoes'>
              <h3 id='informacaoAluno'>Informações d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}</h3>

              <div className='grupoInput'>
                <label htmlFor="nome">Nome</label>
                <div className="inputContainer">
                  <img src={iconUser} alt="" className={isDarkMode ? "dark" : "notDark"}/>
                  <input
                    type="text"
                    id='nome'
                    name='nome'
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className='grupoInput'>
                <label htmlFor="email">Email de Contato</label>
                <div className="inputContainer">
                  <img src={iconEmail} alt="" className={isDarkMode ? "dark" : "notDark"}/>
                  <input
                    type="email"
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className='grupoInput'>
                <label htmlFor="telefone">Telefone de Contato</label>
                <div className="inputContainer">
                  <img src={iconPhone} alt="" className={isDarkMode ? "dark" : "notDark"}/>
                  <input
                    type="tel"
                    id='telefone'
                    name='telefone'
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div id="containerAparencia">
              <div id='containerTema'>
                <div id="containerTextoTema">
                  <h3>Modo Escuro</h3>
                  <span>Troca as cores da tela para um modo escuro</span>
                </div>
                <div className="switch-container">
                  <input type="checkbox" id="meuSwitch" className="switch-checkbox" checked={isDarkMode} onChange={() => toggleDarkMode(!isDarkMode)}/>
                  <label htmlFor="meuSwitch" className="switch-label">
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div id='containerButton'>
            <button
              type='submit'
              onClick={handleSave}
              disabled={!isModified}
              style={{
                opacity: isModified ? 1 : 0.6,
                cursor: isModified ? "pointer" : "not-allowed"
              }}
            >
              Salvar Alterações
            </button>
          </div>

          <div id='containerLogout'>
            <button type='button' onClick={handleOpenLogoutModal}>Sair da conta</button>
          </div>

          <ModalConfirmacaoLogout
            show={showLogoutModal}
            onCancel={handleCloseLogoutModal}
            onConfirm={handleConfirmLogout}
          />
        </div>

        <FundoEscuro show={showLogoutModal} />
      </div>
    </>
  )
}

export default ConfiguracoesPage;
