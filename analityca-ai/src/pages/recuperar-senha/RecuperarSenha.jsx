import './RecuperarSenha.css'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

import setaVoltar from '../../assets/seta-voltar.png';

function RecuperarSenhaPage() {

  const navigate = useNavigate()

  const [credencial, setCredencial] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  async function solicitarEmail(){
    const dados = {
      credencial: credencial
    }

    await fetch("http://localhost:8080/v1/analytica-ai/usuarios/recuperar-senha", {
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

      if (response.status === 404) {
        throw new Error("Credencial inválida. Verifique-a e tente novamente.");
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
      console.log("Solicitação de recuperação de senha feita com sucesso.");
      setErroLogin('');
      navigate("/email-enviado");
    })
    .catch(error => {
      console.error("Erro ao tentar solicitar a recuperação de senha", error.message);

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
      <div id="recuperacaoSenhaContainer">
        <Link to={"/login"} id='botaoVoltar'>
          <img src={setaVoltar} alt="" />
        </Link>
        <div id="recuperacaoSenhaConteudo">
          <div id="recuperacaoSenhaDescricao">
            <h2>Recuperar Senha</h2>
            <p>Digite sua matrícula para enviarmos um e-mail de recuperação.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (e.target.checkValidity()) {
              solicitarEmail()
            }
          }}>
            <div className="grupoInput">
              <label htmlFor="matricula">Matrícula</label>
              <input type="text" id='matricula' className='input' name='matricula' placeholder='Sua matrícula...' value={credencial} onChange={e=>setCredencial(e.target.value)} required/>
            </div>

            <div id="containerErro">
              <p id='mensagemErro' className={erroLogin ? 'visibleError' : 'hiddenError'}>{erroLogin}</p>
            </div>
            
            <button type='submit' id='recuperacaoSenhaSubmitButton'>Enviar</button> 

          </form>
        </div>
      </div>
    </main>
  )
}

export default RecuperarSenhaPage
