import './Configuracoes.css'
import Sidebar from '../../components/sidebar/Sidebar'
import iconUser from '../../assets/configuracoes-icons/user-icon.png'
import iconEmail from '../../assets/configuracoes-icons/email-icon.png'
import iconPhone from '../../assets/configuracoes-icons/phone-icon.png'

function ConfiguracoesPage() {
  const dataUser = JSON.parse(localStorage.getItem("userData"))
  return (
    <>
        <div id="telaConfiguracoes">
            <Sidebar/>
            <div id="containerConfiguracoes">
                <h1 id='title'>Configurações Do Aluno: {dataUser.nome}</h1>
                <hr/>
              <div id='configuracoes'>
                <form action="">
                  <div id='containerInformacoes'>
                    <h3 id='informacaoAluno'>Informações do Aluno</h3>
                    <div className='grupoInput'> 
                      <label htmlFor="nome">Nome</label>
                      <div className="inputContainer">
                        <img src={iconUser} alt="" />
                        <input type="text" id='nome' name='nome' placeholder='Nome do aluno' required/>
                      </div>
                    </div>
                    <div className='grupoInput'> 
                      <label htmlFor="email">Email de Contato</label>
                      <div className="inputContainer">
                        <img src={iconEmail} alt="" />
                        <input type="email" id='email' name='email' placeholder='contato@modelo.com' required/>
                      </div>
                    </div>
                    <div className='grupoInput'> 
                      <label htmlFor="telefone">Telefone de Contato</label>
                      <div className="inputContainer">
                        <img src={iconPhone} alt="" />
                        <input type="tel" id='telefone' name='telefone' placeholder='(11) 9 00000-0000' required/>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div id="containerAparencia">
                    <div id='containerTema'> 
                      <div id="containerTextoTema">
                        <label htmlFor="modoDark">Modo Dark</label>
                        <span>Troca as cores da tela para um modo escuro</span>
                      </div>
                      <input type="checkbox" />
                    </div>
                  </div>
                  <div id='containerButton'>
                    <button type='submit'>Salvar Alterações</button>
                  </div>
                </form>
              </div>
            </div>
        </div>
    </>
  )
}

export default ConfiguracoesPage
