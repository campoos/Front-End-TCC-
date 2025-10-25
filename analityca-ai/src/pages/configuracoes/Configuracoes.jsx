import './Configuracoes.css'
import Sidebar from '../../components/sidebar/Sidebar'
import iconUser from '../../assets/configuracoes-icons/user-icon.png'
import iconEmail from '../../assets/configuracoes-icons/email-icon.png'
import iconPhone from '../../assets/configuracoes-icons/phone-icon.png'

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

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
        <p>Você tem certeza que deseja <strong>sair da sua conta?</strong>. Dados não salvos e preferências temporárias armazenadas neste navegador serão perdidas.</p>
        <div id="modalOptions">
          <button onClick={onCancel} id="buttonCancelar">Cancelar</button> 
          <button onClick={onConfirm} id="buttonConfirmar">Confirmar</button> 
        </div>
      </div>
    </div>
  );
};

function ConfiguracoesPage() {

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

  const navigate = useNavigate();
  const dataUser = JSON.parse(localStorage.getItem("userData"));

  const executeLogout = () => {
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");
    localStorage.removeItem("lembrarCredencial");
    localStorage.removeItem("dashboardFilters");
    localStorage.removeItem("rankingFilters");
    navigate("/login");
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    executeLogout();
    handleCloseLogoutModal();
  };

  return (
    <>
        <div id="telaConfiguracoes">
          <Sidebar/>
          <div id="containerConfiguracoes">
            <div id="containerTexto">
              <h1 id='title'>Configurações Do Aluno: {dataUser.nome}</h1>
              <span id='desc'>Gerencie suas informações e preferências do sistema</span>
            </div>
            <div id='configuracoes'>
              <div id='containerInformacoes'>
                <h3 id='informacaoAluno'>Informações do Aluno</h3>
                <div className='grupoInput'> 
                  <label htmlFor="nome">Nome</label>
                  <div className="inputContainer">
                    <img src={iconUser} alt="" />
                    <input type="text" id='nome' name='nome' placeholder='Nome do aluno' value={dataUser.nome} required/>
                  </div>
                </div>
                <div className='grupoInput'> 
                  <label htmlFor="email">Email de Contato</label>
                  <div className="inputContainer">
                    <img src={iconEmail} alt="" />
                    <input type="email" id='email' name='email' placeholder='contato@modelo.com' value={dataUser.email} required/>
                  </div>
                </div>
                <div className='grupoInput'> 
                  <label htmlFor="telefone">Telefone de Contato</label>
                  <div className="inputContainer">
                    <img src={iconPhone} alt="" />
                    <input type="tel" id='telefone' name='telefone' placeholder='(00) 0 00000-0000' value={dataUser.telefone} required/>
                  </div>
                </div>
              </div>
              <div id="containerAparencia">
                <div id='containerTema'> 
                  <div id="containerTextoTema">
                    <h3>Modo Dark</h3>
                    <span>Troca as cores da tela para um modo escuro</span>
                  </div>
                  <div className="switch-container">
                    <input type="checkbox" id="meuSwitch" className="switch-checkbox"></input>
                    
                    <label htmlFor="meuSwitch" className="switch-label">
                        <span className="switch-slider"></span>
                    </label>
                </div>
                </div>
              </div>
            </div>
            <div id='containerButton'>
              <button type='submit'>Salvar Alterações</button>
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
          <FundoEscuro 
              show={showLogoutModal} 
            />
      </div>
    </>
  )
}

export default ConfiguracoesPage
