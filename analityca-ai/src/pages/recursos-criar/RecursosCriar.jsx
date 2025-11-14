import React from 'react';
import './RecursosCriar.css';
import Sidebar from '../../components/sidebar/Sidebar'; 

const RightSidebar = () => {
    return (
        <aside id="sidebarDireita">
            <div className="cabecalho-sidebar">
                <h2>Atribuir a</h2>
            </div>

            <div className="atribuicao-campos">
                <div className="campo">
                    <label htmlFor="turma">Turma</label>
                    <select id="turma">
                        <option>Selecione</option>
                        <option>3º ano A</option>
                        <option>3º ano B</option>
                        <option>3º ano C</option>
                    </select>
                </div>


                <div className="campo">
                    <label htmlFor="pontos">Pontos</label>
                    <input type="number" id="pontos" placeholder="00/00" />
                </div>


                <div className="campo">
                    <label htmlFor="data">Data de entrega</label>
                    <input type="date" id="data" />
                </div>


                <div className="campo">
                    <label htmlFor="categoria">Categoria da Atividade</label>
                    <select id="categoria">
                        <option>Selecione</option>
                        <option>Prova</option>
                        <option>Trabalho</option>
                        <option>Exercício</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="btn-criar">Criar Atividade</button>

        </aside>
    );
};

function RecursosCriarPage() {
    return (
        <>
            <div id="telaRecursos">
                <Sidebar />

                <div id="containerRecursos">
                    <div className="conteudo-recursos">

                        <div className="cabecalho-recursos">
                           
                            <div className="titulo-com-linha">
                            <h1>Plano de Atividade</h1>
                            <div className="linha-titulo"></div>
                            </div>
                         </div>

                    
                        <form className="formulario-recursos">
                            
                            <div className="campo">
                                <label htmlFor="titulo">Título</label>
                                <input type="text" id="titulo" placeholder="Título da Atividade..." />
                            </div>

                          
                            <div className="campo">
                                <label htmlFor="instrucoes">Instruções</label>
                                <textarea id="instrucoes" rows="5" placeholder="Escreva as instruções aqui..."></textarea>
                            </div>

                           
                            <div className="campo">
                                <label htmlFor="arquivo">Anexar arquivo</label>
                                <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '3rem', textAlign: 'center' }}>
                                    <p style={{ color: '#666' }}>Arraste e solte arquivos aqui</p>
                                    <p style={{ color: '#aaa', margin: '5px 0' }}>ou</p>
                                    <button type="button" style={{ background: '#eee', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '50px', cursor: 'pointer', fontSize: '0.9rem' }}>Navegar Nos Arquivos</button>
                                </div>
                                <input type="file" id="arquivo" style={{ display: 'none' }} />
                            </div>
                            
                            
                        </form>
                    </div>
                </div>
                <RightSidebar />
            </div>
        </>
    );
}

export default RecursosCriarPage;