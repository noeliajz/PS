import React from "react";
import { Route, Routes } from "react-router-dom";
import PaginaError404 from "../pages/PaginaError404";
import HomePage from "../pages/HomePage";
import Evaluacion from "../pages/Evaluacion";
import Agroquimico from "../pages/Agroquimico";
import Sustentabilidad from "../pages/Sustentabilidad";
import NormasDeSeguridad from "../pages/NormasDeSeguridad";
import Entrevista from "../pages/Entrevista";
import Encuesta from "../pages/Encuesta";
import Foro from "../pages/Foro"
import NuevoComentario from "../pages/NuevoComentario";
import Diagrama from "../pages/Diagrama";
import Video from "../pages/Video"
import Indicador from "../pages/Indicador";
import IndicadorHora from "../pages/IndicadorHora";
import IndicadorParticipacion from "../pages/IndicadorParticipacion";


function RoutesPage() {
    return (
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path='*' element={<PaginaError404/>}/>
          <Route path='/error404' element={<PaginaError404/>}/>
          <Route path='/Evaluacion' element={<Evaluacion/>}/>
          <Route path='/Agroquimico' element={<Agroquimico/>}/>
          <Route path='/Sustentabilidad' element={<Sustentabilidad/>}/>
          <Route path='/NormasDeCalidad' element={<NormasDeSeguridad/>}/>
          <Route path='/Entrevista' element={<Entrevista/>}/>
          <Route path='/Encuesta' element={<Encuesta/>}/>
          <Route path='/Foro' element={<Foro/>}/>
          <Route path='/NuevoComentario' element={<NuevoComentario/>}/>
          <Route path='/Diagramas' element={<Diagrama/>}/>
          <Route path='/Video' element={<Video/>}/>
          <Route path='/Indicador' element={<Indicador/>}/>
          <Route path='/IndicadorHora' element={<IndicadorHora/>}/>
          <Route path='/IndicadorParticipacion' element={<IndicadorParticipacion/>}/>

        </Routes>
    );
  }
  
  export default RoutesPage;