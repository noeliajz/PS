import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesPage from "./routes/RoutesPage";
import Navbar2 from "./components/Navbar2";

const App = () => {
  return (
    <Router>
      <Navbar2/>
      <RoutesPage/>
    </Router>
      
  )
}

export default App
