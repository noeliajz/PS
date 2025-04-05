import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

// Colores: Participan, No participan
const COLORS = ["#00C49F", "#FF8042"];

function GraficosIndicador3() {
  const [participantes, setParticipantes] = useState(0); // Participantes en el foro
  const [empleados, setEmpleados] = useState(0);         // Total de empleados

  const noParticipantes = Math.max(empleados - participantes, 0);

  const data = [
    { name: "Participan", value: participantes },
    { name: "No participan", value: noParticipantes },
  ];

  const porcentaje = empleados > 0
    ? ((participantes / empleados) * 100).toFixed(2)
    : 0;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Indicador: Participación en el Foro</h2>
      <p><strong>Fórmula:</strong> (N° de empleados que participan en el foro / Total de empleados) * 100</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Empleados que participan en el foro:
          <input
            type="number"
            value={participantes}
            onChange={(e) => setParticipantes(Number(e.target.value))}
            style={{ marginLeft: "1rem", marginRight: "2rem" }}
          />
        </label>

        <label>
          Total de empleados:
          <input
            type="number"
            value={empleados}
            onChange={(e) => setEmpleados(Number(e.target.value))}
            style={{ marginLeft: "1rem" }}
          />
        </label>
      </div>

      <h3>Porcentaje de Participación: {porcentaje}%</h3>

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
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default GraficosIndicador3;
