import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import setaVoltar from '../../assets/seta-voltar.png';

import { useTheme } from '../../contexts/ThemeContext.jsx'; // Importa o hook

function LoginPage() {

  const { isDarkMode } = useTheme();  

  const navigate = useNavigate()

  const [lembrarDeMim, setLembrarDeMim] = useState(false);

  const [credencial, setCredencial] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  const [estaCarregando, setEstaCarregando] = useState(false); 

  useEffect(() => {
    const credencialSalva = localStorage.getItem("lembrarCredencial")
    const senhaSalva = localStorage.getItem("lembrarSenha")
    if (credencialSalva) {
      setCredencial(credencialSalva)
      if (senhaSalva) {
        setSenha(senhaSalva)
        setLembrarDeMim(true)
      }
    }
  }, [])

  async function validarDados(){
    setEstaCarregando(true)
    const dados = {
      credencial: credencial,
      senha: senha
    }

    await fetch("http://localhost:8080/v1/analytica-ai/usuarios/login", {
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
      localStorage.setItem("userData", JSON.stringify(data.usuario))

      if (lembrarDeMim){
        localStorage.setItem("lembrarCredencial", credencial)
        localStorage.setItem("lembrarSenha", senha)
      }else {
        localStorage.removeItem("lembrarCredencial")
      }

      console.log("Login realizado com sucesso!");
      setErroLogin('');
      setEstaCarregando(false)
      navigate("/dashboards");
    })
    .catch(error => {
      console.error("Erro ao tentar logar", error.message);

      const errorMessage = error.message;

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setErroLogin("Problemas de conexão. Tente novamente mais tarde.");
        setEstaCarregando(false)
      } else {
          setErroLogin(errorMessage);
          setEstaCarregando(false)
      }
    })
  }
  
  return (
    <main id='main'>
      <div id="loginContainer">
        <Link to={"/"} id='botaoVoltar'>
          <img src={setaVoltar} alt="" className={isDarkMode ? "dark" : "notDark"} />
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
              <input type="text" id='matricula' className='inputLogin' name='matricula' placeholder='0000000000' value={credencial} onChange={e=>setCredencial(e.target.value)} required/>
            </div>
            <div className="grupoInput">
              <label htmlFor="senha">Senha</label>
              <input type="password" id='senha' className='inputLogin' name='senha' placeholder='•••••••••••' value={senha} onChange={e=>setSenha(e.target.value)} required/>
            </div>

            <div id="containerErro">
              <p id='mensagemErro' className={erroLogin ? 'visibleError' : 'hiddenError'}> {erroLogin}</p>
            </div>

            <div id="opcoesForm">
              <div id="remember">
                <input type="checkbox" id='lembrar' name='lembrarDeMim' checked={lembrarDeMim} onChange={e => setLembrarDeMim(e.target.checked)}/>
                <label htmlFor="lembrar">Lembrar de mim</label>
              </div>
              <Link to={"/recuperar-senha"} id='esqueceu-senha'>
                Esqueceu a senha?
              </Link>
            </div>
            
            <button type='submit' id='loginSubmitButton'>{estaCarregando ? 'Entrando...' : 'Entrar'}</button>

          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
