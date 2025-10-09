import './RecuperarSenha.css'
import { Link } from "react-router-dom";

import setaVoltar from '../../assets/seta-voltar.png';

function RecuperarSenhaPage() {
  return (
    <main>
      <div id="recuperacaoSenhaContainer">
        <Link to={"/login"} id='botaoVoltar'>
          <img src={setaVoltar} alt="" />
        </Link>
        <div id="recuperacaoSenhaConteudo">
          <div id="recuperacaoSenhaDescricao">
            <h2>Recuperar Senha</h2>
            <p>Digite sua matrícula para enviarmos um e-mail de recuperação.</p>
          </div>

          <form onSubmit={""}>
            <div className="grupoInput">
              <label htmlFor="matricula">Matrícula</label>
              <input type="text" id='matricula' className='input' name='matricula' placeholder='Sua matrícula...' required/>
            </div>

            <div id="containerErro">
              <p id='mensagemErro'>Erro Placeholder</p>
            </div>
            
            <Link to={"/email-enviado"}>
                <button type='submit' id='recuperacaoSenhaSubmitButton'>Enviar</button> 
            </Link>
          </form>
        </div>
      </div>
    </main>
  )
}

export default RecuperarSenhaPage
