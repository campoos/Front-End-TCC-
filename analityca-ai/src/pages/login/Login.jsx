import './Login.css'
import { Link, useNavigate } from "react-router-dom";

import setaVoltar from '../../assets/seta-voltar.png';

function LoginPage() {

  const navigate = useNavigate()
  
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

          <form onSubmit={(e) => {
            e.preventDefault();
            if (e.target.checkValidity()) {
              navigate("/dashboards");
            }
          }}>
            <div className="grupoInput">
              <label for="email">E-mail</label>
              <input type="email" id='email' name='email' placeholder='seu.email@exemplo.com' required/>
            </div>
            <div className="grupoInput">
              <label for="senha">Senha</label>
              <input type="password" id='senha' name='senha' placeholder='•••••••••••' minLength={6} required/>
            </div>

            <div id="opcoesForm">
              <div id="remember">
                <input type="checkbox" id='lembrar' name='lembrarDeMim'/>
                <label for="lembrar">Lembrar de mim</label>
              </div>
              <a href="/">Esqueceu a senha?</a>
            </div>
            
            <a id='loginSubmitButtonContainer'>
              <button type='submit' id='loginSubmitButton'>Entrar</button>
            </a>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
