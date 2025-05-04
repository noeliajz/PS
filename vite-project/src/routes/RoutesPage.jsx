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
import Simulacion from "../pages/Simulacion";
import IndicadorTodos from "../pages/IndicadorTodos";
import EditarComentario from "../pages/EditarComentario";
import EditarDiagrama from "../pages/EditarDiagrama";
import EditarVideo from "../pages/EditarVideo";
import EditarIndicador from "../pages/EditarIndicador";
import EditarSimulacion from "../pages/EditarSimulacion";
import EditarEvaluacion from "../pages/EditarEvaluacion";
import EditarEntrevista from "../pages/EditarEntrevista";
import EditarEncuesta from "../pages/EditarEncuesta";
import ForoUsuario from "../pages/ForoUsuario";
import EvaluacionUsuario from "../pages/EvaluacionUsuario";
import EncuestaUsuario from "../pages/EncuestaUsuario";
import VideosUsuario from "../pages/VideosUsuario"


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
          <Route path='/Simulacion' element={<Simulacion/>}/>
          <Route path='/IndicadorTodos' element={<IndicadorTodos/>}/>
          <Route path='/EditarComentario/:id' element={<EditarComentario/>}/>
          <Route path='/EditarDiagrama/:id' element={<EditarDiagrama/>}/>
          <Route path='/EditarVideo/:id' element={<EditarVideo/>}/>
          <Route path='/EditarIndicador/:id' element={<EditarIndicador/>}/>
          <Route path='/EditarSimulacion/:id' element={<EditarSimulacion/>}/>
          <Route path='/EditarEvaluacion/:id' element={<EditarEvaluacion/>}/>
          <Route path='/EditarEntrevista/:id' element={<EditarEntrevista/>}/>
          <Route path='/EditarEncuesta/:id' element={<EditarEncuesta/>}/>
          <Route path='/ForoUsuario' element={<ForoUsuario/>}/>
          <Route path='/EvaluacionUsuario' element={<EvaluacionUsuario/>}/>
          <Route path='/EncuestaUsuario' element={<EncuestaUsuario/>}/>
          <Route path='/VideosUsuario' element={<VideosUsuario/>}/>

        </Routes>
    );
  }
  
  export default RoutesPage;