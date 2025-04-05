import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

// Colores: una porción para "Horas por empleado" y otra de referencia
const COLORS = ["#00C49F", "#FF8042"]; 

function GraficosIndicador2() {
  const [horasTotales, setHorasTotales] = useState(0);
  const [empleados, setEmpleados] = useState(1); // evitar división por cero

  const horasPorEmpleado = empleados > 0 ? horasTotales / empleados : 0;

  const data = [
    { name: "Horas por empleado", value: horasPorEmpleado },
    { name: "Resto (sin uso)", value: 100 - horasPorEmpleado > 0 ? 100 - horasPorEmpleado : 0 },
  ];

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Horas de Capacitación por Empleado</h2>
      <p><strong>Fórmula:</strong> Total de horas de capacitación / Total de empleados</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Total de horas de capacitación:
          <input
            type="number"
            value={horasTotales}
            onChange={(e) => setHorasTotales(Number(e.target.value))}
            style={{ marginLeft: "1rem", marginRight: "2rem" }}
          />
        </label>

        <label>
          Total de empleados:
          <input
            type="number"
            value={empleados}
            min="1"
            onChange={(e) => setEmpleados(Number(e.target.value))}
            style={{ marginLeft: "1rem" }}
          />
        </label>
      </div>

      <h4>Horas promedio por empleado: <span style={{ color: "#0088FE" }}>{horasPorEmpleado.toFixed(2)}</span></h4>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default GraficosIndicador2;
