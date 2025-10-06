import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

import setaVoltar from '../../assets/seta-voltar.png';

function LoginPage() {

  const navigate = useNavigate()

  const [credencial, setCredencial] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  function validarDados(){
    const dados = {
      credencial: credencial,
      senha: senha
    }

    fetch("http://localhost:8080/v1/analytica-ai/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    })
    .then(async response => {
      if (response.ok) {
        return response.json(); 
      }

      if (response.status === 401) {
        throw new Error("Serviço de login não encontrado. Tente novamente mais tarde.");
      }
      if (response.status === 404) {
        throw new Error("Credenciais inválidas. Verifique sua matrícula e senha.");
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        if (response.status >= 500) {
          setErroLogin("Falha interna do servidor.")
           throw new Error(`Erro ${response.status}: Falha interna do servidor. Tente novamente mais tarde.`);
        }
        throw new Error(`Erro ${response.status}: Resposta inesperada do servidor.`);
      }
      throw new Error(errorData.message || 'Erro desconhecido.'); 
      
    })
    .then(data =>{
      console.log("Login realizado com sucesso!");
      setErroLogin('');
      navigate("/dashboards");
    })
    .catch(error => {
      console.error("Erro ao tentar logar", error.message);

      const errorMessage = error.message;

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setErroLogin("Problemas de conexão. Tente novamente mais tarde.");
      } else {
          setErroLogin(errorMessage);
      }
    })
  }
  
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
              validarDados()
            }
          }}>
            <div className="grupoInput">
              <label htmlFor="matricula">Matrícula</label>
              <input type="text" id='matricula' name='matricula' placeholder='0000000000' value={credencial} onChange={e=>setCredencial(e.target.value)} required/>
            </div>
            <div className="grupoInput">
              <label htmlFor="senha">Senha</label>
              <input type="password" id='senha' name='senha' placeholder='•••••••••••' value={senha} onChange={e=>setSenha(e.target.value)} required/>
            </div>

            <div id="containerErro">
              <p id='mensagemErro' className={erroLogin ? 'visibleError' : 'hiddenError'}> {erroLogin}</p>
            </div>

            <div id="opcoesForm">
              <div id="remember">
                <input type="checkbox" id='lembrar' name='lembrarDeMim'/>
                <label htmlFor="lembrar">Lembrar de mim</label>
              </div>
              <a href="/">Esqueceu a senha?</a>
            </div>
            
            <button type='submit' id='loginSubmitButton'>Entrar</button>

          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
