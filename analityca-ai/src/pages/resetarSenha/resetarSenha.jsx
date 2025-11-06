import './resetarSenha.css'
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function ResetarSenhaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroRedefinir, setErroRedefinir] = useState('');

  const [estaCarregando, setEstaCarregando] = useState(false);
  const [statusToken, setStatusToken] = useState('carregando');

  // ✅ Só valida o token ao carregar a página
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');

    if (!tokenFromUrl) {
      setErroRedefinir('Token de redefinição não encontrado na URL.');
      setStatusToken('inexistente');
      return; // não continua
    }

    setToken(tokenFromUrl);

    async function validarToken() {
      try {
        const response = await fetch(`http://localhost:8080/v1/analytica-ai/usuarios/verificar-token/${tokenFromUrl}`, {
          method: "GET"
        });

        if (response.ok) {
          setStatusToken("valido");
        } else if (response.status === 400 || response.status === 404) {
          let errorMessage = 'Token inválido ou expirado.';

          setErroRedefinir(errorMessage);
          setStatusToken("invalido");
        } else {
          setErroRedefinir("Ocorreu um erro ao verificar o token.");
          setStatusToken('invalido');
        }
      } catch (error) {
        console.error("Erro na validação inicial do token:", error);
        setErroRedefinir("Problemas de conexão ou no servidor.");
        setStatusToken('conexao');
      }
    }

    validarToken();
  }, [searchParams]);

  // ✅ Função de redefinição de senha — só roda no clique do botão
  async function validarDados() {
    if (novaSenha !== confirmarSenha) {
      setErroRedefinir('As senhas não coincidem.');
      return;
    }

    if (novaSenha.length < 8 || novaSenha.length > 20) {
      setErroRedefinir('A senha deve ter entre 8 e 20 caracteres.');
      return;
    }

    if (!token) {
      setErroRedefinir('Token inválido ou ausente.');
      setStatusToken('invalido');
      return;
    }

    setEstaCarregando(true);

    const dados = {
      token: token,
      nova_senha: novaSenha
    };

    try {
      const response = await fetch("http://localhost:8080/v1/analytica-ai/usuarios/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (response.ok) {
        console.log("Redefinição de senha realizada com sucesso!");
        setErroRedefinir('');
        setEstaCarregando(false);
        navigate("/senha-resetada");
        return;
      }

      if (response.status === 401) throw new Error("Token inválido ou expirado. Por favor, solicite uma nova recuperação.");
      if (response.status === 400) throw new Error("Token e nova senha são obrigatórios.");

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha inesperada no servidor.`);
    } catch (error) {
      console.error("Erro ao tentar redefinir senha:", error);
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setErroRedefinir("Problemas de conexão.");
      } else {
        setErroRedefinir(error.message);
      }
    } finally {
      setEstaCarregando(false);
    }
  }

  // ✅ Telas de estado
  if (statusToken === "carregando") {
    return <main><div id="redefinirContainerCarregando"><p>Carregando...</p></div></main>;
  }

  if (statusToken === "inexistente") {
    return (
      <main id='main'>
        <div id="redefinirContainerErro">
          <div id="redefinirConteudo" className="erroFatal">
            <h2>Ops!</h2>
            <span>{erroRedefinir}</span>
            <p>Verifique o link enviado para o seu e-mail e tente novamente.</p>
            <button onClick={() => navigate('/login')}>Ir para a página de Login</button>
          </div>
        </div>
      </main>
    );
  }

  if (statusToken === "conexao" || statusToken === "invalido") {
    return (
      <main id='main'>
        <div id="redefinirContainerErro">
          <div id="redefinirConteudo" className="erroFatal">
            <h2>Ops!</h2>
            <span>{erroRedefinir}</span>
            <p>
              {statusToken === "conexao"
                ? "Não conseguimos nos comunicar com o servidor. Verifique sua conexão."
                : "Se o problema persistir, solicite uma nova recuperação de senha."}
            </p>
            <button onClick={() => navigate('/login')}>Ir para a página de Login</button>
          </div>
        </div>
      </main>
    );
  }

  // ✅ Tela principal (token válido)
  return (
    <main id='main'>
      <div id="redefinirContainer">
        <div id="redefinirConteudo">
          <div id="redefinirDescricao">
            <h2>Redefinir Senha</h2>
            <p>Crie sua nova senha</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (e.target.checkValidity()) validarDados();
          }}>
            <div className="grupoInput">
              <label htmlFor="novaSenha">Nova senha</label>
              <input
                type="password"
                id="novaSenha"
                className="inputLogin"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                placeholder="•••••••••••"
                required
              />
            </div>

            <div className="grupoInput">
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input
                type="password"
                id="confirmarSenha"
                className="inputLogin"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="•••••••••••"
                required
              />
            </div>

            <div id="containerErro">
              <p id="mensagemErro" className={erroRedefinir ? 'visibleError' : 'hiddenError'}>
                {erroRedefinir}
              </p>
            </div>

            <button type="submit" id="redefinirSubmitButton">
              {estaCarregando ? 'Redefinindo...' : 'Redefinir'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetarSenhaPage;
