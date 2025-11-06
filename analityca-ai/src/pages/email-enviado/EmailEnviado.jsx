import './EmailEnviado.css'
import { Link } from "react-router-dom";

function EmailEnviadoPage() {
  return (
    <main id='main'>
      <div id="emailEnviadoContainer">
        <div id="emailEnviadoConteudo">
          <div id="emailEnviadoDescricao">
            <h2>E-mail Enviado!</h2>
            <p>Um e-mail para redefinição de senha foi enviado para seu e-mail educacional. Por favor, verifique a caixa de entrada.</p>
          </div>
            <Link to={"/login"}>
                <button type='submit' id='recuperacaoSenhaSubmitButton'>Voltar para o Login</button> 
            </Link>
        </div>
      </div>
    </main>
  )
}

export default EmailEnviadoPage
