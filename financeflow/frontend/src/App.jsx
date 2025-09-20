import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      <h1>🚀 FinanceFlow</h1>
      <p>Seu sistema de controle financeiro já está rodando!</p>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: "10px 20px",
          marginTop: "1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#4CAF50",
          color: "#fff",
          fontSize: "16px",
        }}
      >
        Cliquei {count} vezes
      </button>
    </div>
  );
}
