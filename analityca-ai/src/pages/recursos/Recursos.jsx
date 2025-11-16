import './Recursos.css'
import Sidebar from '../../components/sidebar/Sidebar'

function RecursosPage() {

  const dataUser = JSON.parse(localStorage.getItem("userData"))

  return (
    <>
      <div id="telaRecursosHome">
        <Sidebar />
        <div id="containerRecursosHome">
          <div id="containerTexto">
            <h1 id='title'>Plano de atividade d{dataUser.nivel_usuario === "gestão" ? "a" : "o"} {dataUser.nivel_usuario}: {dataUser.nome}</h1>
            <hr />
          </div>
          <div id="secoes">
            <label htmlFor="">Mural</label>
            <label htmlFor="">Atividades</label>
          </div>
          <div id="containerAtividades">
            <h2>Aqui é onde você visualiza as atividades</h2>
            <span>Você pode ver suas atividades e outros trabalhos por aqui.</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default RecursosPage;
