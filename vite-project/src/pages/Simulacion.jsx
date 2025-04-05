import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {simulaciones.map((sim) => (
          <li key={sim._id} style={{ marginBottom: '10px' }}>
            <strong>{new Date(sim.fecha).toLocaleDateString()}</strong> - {sim.capacitador} - {sim.precondicion} - Asistentes: {sim.personalQueAsiste}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Simulacion;
