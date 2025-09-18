import './Home.css'
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <div id="container1">
        <div id="header">
          <div id="logo">
            <h1>Analytica AI</h1>
          </div>
          <div id="links">
            <a href="" className="link">Recursos</a>
            <a href="" className="link">Benefícios</a>
            <a href="" className="link">Contato</a>
          </div>
          <div id="botaoContainer">
            <Link to="/login" id="login">
                Login
            </Link>
          </div>
        </div>
        <div id="containerTextoHome">
          <h1>A inteligência que transforma dados em resultados</h1>
          <h2>Transformando dados em aprendizado inteligente.</h2>
          <div id="botaoContainer">
            <Link to="/login" id="comecarAgora">
              Começar Agora
            </Link>
          </div>
        </div>
      </div>
      <div id="container2">
        <h1 id='tituloRecursos'>Nossos Recursos</h1>
        <div id="containersRecursos">
          <div className="containerRecurso">
            <h1>📊</h1>
            <h2>Dashboard de Performance</h2>
            <span>Gráficos e relatórios interativos para visualizar o progresso de forma clara e intuitiva.</span>
          </div>
          <div className="containerRecurso">
            <h1>📝</h1>
            <h2>Planos Personalizados</h2>
            <span>Planos de estudo sob medida, adaptados ao ritmo e às necessidades de cada usuário.</span>
          </div>
          <div className="containerRecurso">
            <h1>🧠</h1>
            <h2>Análise de IA</h2>
            <span>Insights gerados por inteligência artificial para otimizar o desempenho acadêmico.</span>
          </div>
        </div>
      </div>
      <div id="container3">
        <div id="containerMain">
          <h1>Benefícios para Todos</h1>
          <div id="containerTextos">
            <div className="containerTexto">
              <h2>Famílias</h2>
              <span>Tenha transparência total no acompanhamento do progresso dos seus filhos. Receba insights valiosos e relatórios personalizados para apoiar a jornada de aprendizado deles.</span>
            </div>
            <div className="containerTexto">
              <h2>Famílias</h2>
              <span>Tenha transparência total no acompanhamento do progresso dos seus filhos. Receba insights valiosos e relatórios personalizados para apoiar a jornada de aprendizado deles.</span>
            </div>
            <div className="containerTexto">
              <h2>Famílias</h2>
              <span>Tenha transparência total no acompanhamento do progresso dos seus filhos. Receba insights valiosos e relatórios personalizados para apoiar a jornada de aprendizado deles.</span>
            </div>
          </div>
        </div>
        <div id="footer">
          <span>Contato: analyticaAI@gmail.com</span>
          <span>© 2025 Analytica AI. Todos os direitos reservados</span>
        </div>
      </div>
    </>
  )
}

export default HomePage
