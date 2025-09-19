import './Login.css'
import { Link } from "react-router-dom";

import setaVoltar from '../../assets/seta-voltar.png';

function LoginPage() {
  return (
    <main>
      <div id="loginContainer">
        <Link to={"/"} id='botaoVoltar'>
          <img src={setaVoltar} alt="" />
        </Link>
        <div id="loginConteudo">
          <div id="loginDescricao">
            <h2>Login</h2>
            <p>Acesse sua conta para continuar</p>
          </div>

          <form action="">
            <div className="grupoInput">
              <label for="email">E-mail</label>
              <input type="email" id='email' name='email' placeholder='seu.email@exemplo.com' required/>
            </div>
            <div className="grupoInput">
              <label for="senha">Senha</label>
              <input type="password" id='senha' name='senha' placeholder='•••••••••••' required/>
            </div>

            <div id="opcoesForm">
              <div id="remember">
                <input type="checkbox" id='lembrar' name='lembrarDeMim'/>
                <label for="lembrar">Lembrar de mim</label>
              </div>
              <a href="/">Esqueceu a senha?</a>
            </div>
            
            <Link to={"/dashboards"} id='loginSubmitButtonContainer'>
              <button type='submit' id='loginSubmitButton'>Entrar</button>
            </Link>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
