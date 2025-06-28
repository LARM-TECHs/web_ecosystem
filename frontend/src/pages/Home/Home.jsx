import React from "react";
import Header from "../../components/Header/Header";
import "./Home.css";

const Home = () => {
    return (
        <>
            <Header />

            <main className="main-content">
                <div className="app-container">
                    {/* Notas */}
                    <div className="app-card">
                        <svg className="app-card-icon" width="165px" height="155px">
                            <use xlinkHref="/sprite.svg#icon-notes" />
                        </svg>
                        <h2 className="app-card-title">Notas</h2>
                    </div>

                    {/* Biblioteca */}
                    <div className="app-card">
                        <svg className="app-card-icon" width="146px" height="126px">
                            <use xlinkHref="/sprite.svg#icon-library" />
                        </svg>
                        <h2 className="app-card-title">Biblioteca</h2>
                    </div>

                    {/* Chat IA */}
                    <div className="app-card">
                        <svg width="191px" height="156px">
                            <use xlinkHref="/sprite.svg#icon-chat-ia" />
                        </svg>
                        <h2 className="app-card-title">Chat IA</h2>
                    </div>

                    {/* Comedor */}
                    <div className="app-card">
                        <svg width="135px" height="135px">
                            <use xlinkHref="/sprite.svg#icon-dinner" />
                        </svg>
                        <h2 className="app-card-title">Comedor</h2>
                    </div>

                    {/* Votaciones */}
                    <div className="app-card">
                        <svg width="144px" height="157px">
                            <use xlinkHref="/sprite.svg#icon-votes" />
                        </svg>
                        <h2 className="app-card-title">Votaciones</h2>
                    </div>

                    {/* Horario */}
                    <div className="app-card">
                        <svg width="172px" height="177px">
                            <use xlinkHref="/sprite.svg#icon-calendar" />
                        </svg>
                        <h2 className="app-card-title">Horario</h2>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;