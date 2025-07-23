'use client'

import { useEffect } from "react";
import { useState } from "react"


export default function HomePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");


  const handleSubmit = async () => {
    setResponse("");
    setError("");

    
    try {
      const res = await fetch("http://127.0.0.1:8000/agent/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Agent_1", 
        prompt: prompt
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Error desconocido");
    }

    setResponse(data.response);  
    }
    
    catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error de red.")
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Simulador de Agente GPT</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Escribe un mensaje"
        style={{ marginRight: "1rem", padding: "0.5rem"}}
      />
      <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem"}}>
        Enviar
      </button>

      {response && <p> <strong>Respuesta:</strong> {response} </p>}
      {error && <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>}
    </main>
  );

}
