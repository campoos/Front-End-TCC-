import './resetarSenha.css'
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function ResetarSenhaPage() {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroRedefinir, setErroRedefinir] = useState('');

  const [estaCarregando, setEstaCarregando] = useState(false); 

  const [tokenVerificado, setTokenVerificado] = useState(false); 

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setTokenVerificado(true); 
    } else {
      // Se não houver token na URL, redireciona ou mostra uma mensagem de erro
      setErroRedefinir('Token de redefinição não encontrado na URL.');
      setTokenVerificado(true); 
    }
  }, [searchParams]);



  async function validarDados(){
    
     if (novaSenha !== confirmarSenha) {
      setErroRedefinir('As senhas não coincidem.');
      return;
    }
    
    // Validação de comprimento da senha (seguindo a regra do seu backend: 4 a 20)
    if (novaSenha.length < 4 || novaSenha.length > 20) {
      setErroRedefinir('A senha deve ter entre 4 e 20 caracteres.');
      return;
    }

    if (!token) {
        setErroRedefinir('Token inválido ou ausente.');
        return;
    }

    setEstaCarregando(true)

    const dados = {
      token: token,
      nova_senha: novaSenha
    }

    console.log(dados)

    await fetch("http://localhost:8080/v1/analytica-ai/usuarios/resetar-senha", {
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
        throw new Error("Token inválido ou expirado. Por favor, solicite uma nova recuperação.");
      }
      if (response.status === 400) {
        throw new Error("Token e nova senha são obrigatórios.");
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        if (response.status >= 500) {
          setErroRedefinir("Falha interna do servidor.")
           throw new Error(`Erro ${response.status}: Falha interna do servidor. Tente novamente mais tarde.`);
        }
        throw new Error(`Erro ${response.status}: Resposta inesperada do servidor.`);
      }
      throw new Error(errorData.message || 'Erro desconhecido.'); 
      
    })
    .then(data =>{
      console.log("redefinição de senha realizada com sucesso!");
      setErroRedefinir('');
      setEstaCarregando(false)
      navigate("/senha-resetada");
    })
    .catch(error => {
      console.error("Erro ao tentar redefinir senha", error.message);

      const errorMessage = error.message;

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setErroRedefinir("Problemas de conexão. Tente novamente mais tarde.");
        setEstaCarregando(false)
      } else {
          setErroRedefinir(errorMessage);
          setEstaCarregando(false)
      }
    })
  }
  // 1. Renderização de carregamento inicial
  if (!tokenVerificado) {
    return (
      <main>
        <div id="redefinirContainerCarregando">
            <p>Carregando...</p> 
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main>
        <div id="redefinirContainerErro">
          <div id="redefinirConteudo" className="erroFatal">
            <h2>Ops! Link Inválido</h2>
            <p id='mensagemErro' className='visibleError'>{erroRedefinir}</p>
            <p>Por favor, utilize o link de redefinição completo enviado para o seu e-mail.</p>
            <button onClick={() => navigate('/login')}>Ir para a página de Login</button>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main>
      <div id="redefinirContainer">
        <div id="redefinirConteudo">
          <div id="redefinirDescricao">
            <h2>Redefinir Senha</h2>
            <p>Crise sua nova senha</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (e.target.checkValidity()) {
              validarDados()
            }
          }}>
            <div className="grupoInput">
              <label htmlFor="novaSenha">Nova senha</label>
              <input type="password" id='novaSenha' className='inputLogin' name='novaSenha' placeholder='•••••••••••' value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} required/>
            </div>
            <div className="grupoInput">
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input type="password" id='confirmarSenha' className='inputLogin' name='confirmarSenha' placeholder='•••••••••••' value={confirmarSenha} onChange={e=>setConfirmarSenha(e.target.value)} required/>
            </div>

            <div id="containerErro">
              <p id='mensagemErro' className={erroRedefinir ? 'visibleError' : 'hiddenError'}> {erroRedefinir}</p>
            </div>

            <button type='submit' id='redefinirSubmitButton'>{estaCarregando ? 'Redefinindo...' : 'Redefinir'}</button>

          </form>
        </div>
      </div>
    </main>
  )
}

export default ResetarSenhaPage
