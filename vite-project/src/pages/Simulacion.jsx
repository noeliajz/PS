import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Simulacion() {
  const [simulaciones, setSimulaciones] = useState([]);
  const [form, setForm] = useState({
    fecha: '',
    precondicion: '',
    capacitador: '',
    personalQueAsiste: ''
  });

  useEffect(() => {
    fetchSimulaciones();
  }, []);

  const fetchSimulaciones = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/simulacion');
      setSimulaciones(res.data.simulaciones);
    } catch (err) {
      console.error("Error al obtener simulaciones", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/simulacion', form);
      setForm({ fecha: '', precondicion: '', capacitador: '', personalQueAsiste: '' });
      fetchSimulaciones();
    } catch (err) {
      console.error("Error al crear simulación", err);
    }
  };

  const eliminarSimulacion = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la simulación permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/simulacion/${id}`);
        Swal.fire('Eliminado', 'La simulación fue eliminada', 'success');
        fetchSimulaciones();
      } catch (err) {
        console.error("Error al eliminar simulación", err);
        Swal.fire('Error', 'No se pudo eliminar la simulación', 'error');
      }
    }
  };

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <h2>Planifica Simulaciones</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            style={{ marginLeft: '5px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Precondición:</label>
          <input
            type="text"
            name="precondicion"
            value={form.precondicion}
            onChange={handleChange}
            required
            style={{ marginLeft: '5px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Capacitador:</label>
          <input
            type="text"
            name="capacitador"
            value={form.capacitador}
            onChange={handleChange}
            required
            style={{ marginLeft: '5px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Personal que asiste:</label>
          <input
            type="text"
            name="personalQueAsiste"
            value={form.personalQueAsiste}
            onChange={handleChange}
            required
            style={{ marginLeft: '5px', width: '100%' }}
          />
        </div>
        <button className='btn btn-success' type="submit">Guardar</button>
      </form>

      <hr style={{ width: '100%', marginTop: '2rem', marginBottom: '2rem' }} />

      <h3>Simulaciones registradas</h3>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Capacitador</th>
              <th>Precondición</th>
              <th>Asistentes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {simulaciones.map((sim) => (
              <tr key={sim._id}>
                <td>{new Date(sim.fecha).toLocaleDateString()}</td>
                <td>{sim.capacitador}</td>
                <td>{sim.precondicion}</td>
                <td>{sim.personalQueAsiste}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarSimulacion(sim._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {simulaciones.length === 0 && (
              <tr>
                <td colSpan="5">No hay simulaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Simulacion;
