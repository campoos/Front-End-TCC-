import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

import setaVoltar from '../../assets/seta-voltar.png';

function LoginPage() {

  const navigate = useNavigate()

  const [matricula, setMatricula] = useState('');

  const handleOnlyNumbers = (e) => {
      const onlyNums = e.target.value.replace(/\D/g, ''); 
      
      setMatricula(onlyNums.substring(0, 11));
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      if (e.target.checkValidity()) {
          navigate("/dashboards");
      }
  };
  
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

          <form onSubmit={handleSubmit}>
            <div className="grupoInput">
              <label for="matricula">Matrícula</label>
              <input type="text" id='matricula' name='matricula' placeholder='0000000000' maxLength={10} minLength={10} value={matricula} onChange={handleOnlyNumbers} required/>
            </div>
            <div className="grupoInput">
              <label for="senha">Senha</label>
              <input type="password" id='senha' name='senha' placeholder='•••••••••••' minLength={8} maxLength={20} required/>
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
