import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

// Colores para los sectores
const COLORS = ["#00C49F", "#FF8042"]; // Participantes, No Participantes

function GraficosIndicador() {
  const [capacitaciones, setCapacitaciones] = useState(0); // Empleados capacitados
  const [empleados, setEmpleados] = useState(0); // Total de empleados

  const noCapacitados = Math.max(empleados - capacitaciones, 0); // evitar negativos

  const data = [
    { name: "Capacitados", value: capacitaciones },
    { name: "No Capacitados", value: noCapacitados },
  ];

  const porcentaje = empleados > 0
    ? ((capacitaciones / empleados) * 100).toFixed(2)
    : 0;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Indicador: Tasa de Participación en Capacitaciones</h2>
      <p>Fórmula: (N° de empleados capacitados / Total de empleados) * 100</p>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Empleados Capacitados:
          <input
            type="number"
            value={capacitaciones}
            onChange={(e) => setCapacitaciones(Number(e.target.value))}
            style={{ marginLeft: "1rem", marginRight: "2rem" }}
          />
        </label>

        <label>
          Total de Empleados:
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

export default GraficosIndicador;
