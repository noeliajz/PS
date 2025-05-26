import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const PagParaTodos = () => {
  const [showModal, setShowModal] = useState(false);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    const cat = localStorage.getItem("categoria");
    if (cat) {
      setCategoria(cat);
      setShowModal(true);

      if (cat === "comercial") {
        Swal.fire({
          title: "¡Área Comercial!",
          text: "Revisa las últimas actualizaciones del área de producción.",
          imageUrl: "https://unsplash.it/400/201", // Cambia la imagen si quieres diferenciar
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Imagen producción",
          html: `
            Consulta <b>los procesos recientes</b>,
            entra a 
            <ul>
               <li> <a href="/Novedades" autofocus>NOVEDADES</a></li>
               <li> <a href="/Produccion" autofocus>FACTURACIÓN</a></li>
          </ul>
          `
                
        });
      }

      if (cat === "produccion") {
        Swal.fire({
          title: "¡Novedades en Producción!",
          text: "Revisa las últimas actualizaciones del área de producción.",
          imageUrl: "https://unsplash.it/400/201", // Cambia la imagen si quieres diferenciar
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "Imagen producción",
          html: `
            Consulta <b>los procesos recientes</b>,
            entra a 
            <ul>
               <li> <a href="/Produccion" autofocus>Novedades</a>,
            y mantente al día con las operaciones.</li>
               <li> <a href="/Produccion" autofocus>Agroquimicos y normas de seguridad</a>,
            y mantente al día con las operaciones.</li>
          </ul>
          `
                
        });
      }
    }
  }, []);

  return (
    <div>
      <h1>Bienvenidos</h1>
      {/* El modal de Bootstrap está comentado */}
    </div>
  );
};

export default PagParaTodos;
