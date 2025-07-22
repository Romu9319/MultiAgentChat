'use client'

import { useEffect } from "react";
import { useState } from "react"


export default function HomePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");


  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3001/agent/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Agent_1", 
        prompt: prompt
      }),
    });

    if (!res.ok) {
      throw new Error("Error al conectar con backend");
    }

    const data: { response: string } = await res.json();
    setResponse(data.response);  
    }
    
    catch (error) {
      console.error("Error:", error);
      setResponse("Error al obtener respuesta del agente.")
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
      <button onClick={handleSubmit}>
        Enviar
      </button>
      <p>
        <strong>Respuesta:</strong> {response}
      </p>
    </main>
  );

}
