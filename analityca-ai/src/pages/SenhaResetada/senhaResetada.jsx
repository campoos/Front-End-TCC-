import './senhaResetada.css'
import { Link } from "react-router-dom";

function SenhaResetadaPage() {
  return (
    <main id='main'>
      <div id="senhaResetadaContainer">
        <div id="senhaResetadaConteudo">
          <div id="senhaResetadaDescricao">
            <h2>Senha Redefinida!!</h2>
            <p>Sua senha foi redefinida com sucesso. Você já pode voltar para a tela de login.</p>
          </div>
            <Link to={"/login"}>
                <button type='submit' id='senhaResetadaSubmitButton'>Voltar para o Login</button> 
            </Link>
        </div>
      </div>
    </main>
  )
}

export default SenhaResetadaPage
