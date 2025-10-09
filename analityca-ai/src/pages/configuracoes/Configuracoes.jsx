import './Configuracoes.css'
import Sidebar from '../../components/sidebar/Sidebar'

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
                <h3 id='informacaoAluno'>Informações do Aluno</h3>
                <div id='containerInformacoes'>
                  <form action="">
                    <div className='grupoInput'> 
                      <label HTMLfor="nome">Nome</label>
                      <input type="text" id='nome' name='nome' placeholder='Nome do aluno' required/>
                    </div>
                    <div className='grupoInput'> 
                      <label HTMLfor="email">Email de Contato</label>
                      <input type="email" id='email' name='email' placeholder='contato@modelo.com' required/>
                    </div>
                    <div className='grupoInput'> 
                      <label HTMLfor="telefone">Telefone de Contato</label>
                      <input type="tel" id='telefone' name='telefone' placeholder='(11) 9 00000-0000' required/>
                    </div>
                    <hr/>
                    <div id='containerModo'>
                      <label HTMLfor="modoDark">Modo Dark</label>
                    </div>
                    <span>Troca as cores da tela para um modo escuro</span>
                    <div id='containerButton'>
                      <button type='submit'>Salvar Alterações</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default ConfiguracoesPage
