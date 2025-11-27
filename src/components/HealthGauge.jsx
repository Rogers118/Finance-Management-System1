import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const HealthGauge = ({ score }) => {
  const COLORS = [
    "#ff4d4d", // red (0–40)
    "#ffb84d", // orange (40–70)
    "#4dff88", // green (70–100)
  ];

  const getColor = () => {
    if (score < 40) return COLORS[0];
    if (score < 70) return COLORS[1];
    return COLORS[2];
  };

  const data = [
    { value: score },
    { value: 100 - score },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>Financial Health Score</h3>
      <PieChart width={220} height={120}>
        <Pie
          data={data}
          cx={110}
          cy={120}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
        >
          <Cell fill={getColor()} />
          <Cell fill="#eee" />
        </Pie>
      </PieChart>
      <div
        style={{
          marginTop: "-60px",
          fontSize: "2rem",
          fontWeight: "bold",
          color: getColor(),
        }}
      >
        {score}/100
      </div>
      <p style={{ color: "#555", marginTop: "0.5rem" }}>
        {score >= 80
          ? "Excellent 💰"
          : score >= 50
          ? "Fair ⚖️"
          : "Needs Improvement ⚠️"}
      </p>
    </div>
  );
};

export default HealthGauge;
