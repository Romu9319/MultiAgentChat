'use client'

import { useEffect, useState } from "react";

// tipos de mensajes
type Message = {
  sender: "user" | "agent";
  content: string;
};


export default function HomePage() {
  const [agents, setAgents] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
// historial local
  const [history, setHistory] = useState<Record<string, Message[]>>({});


  useEffect(() => {
    fetch("http://127.0.0.1:8000/agents")
      .then((res) => res.json())
      .then((data: string[]) => {
        setAgents(data);
        if (data.length > 0) {
          setSelectedAgent(data[0]);
          const initialHistory: Record<string, Message[]> = {};
          data.forEach((ag) => (initialHistory[ag] = []));
          setHistory(initialHistory);
        }
      })
      .catch((err) => {
        console.error("Error cargando agente:", err);
        setError("No se pudieron cargar los agentes.");
      });
  }, []);


  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("El mensaje no puede estar vacio");
      return;
    }

    //Agregar mensajes del ususario al historias
    setHistory((prev) => ({
      ...prev,
      [selectedAgent]: [
        ...prev[selectedAgent],
        { sender: "user", content: prompt },
      ],
    }));    
    setResponse("");
    setError("");

    
    try {
      const res = await fetch("http://127.0.0.1:8000/agent/respond", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        name: selectedAgent, 
        prompt: prompt
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Error desconocido");
    }

//Agregar respuestas del agente al historial
    setHistory((prev) => ({
      ...prev,
      [selectedAgent]: [
        ...prev[selectedAgent],
        { sender: "agent", content: data.response },
      ],
    }));
    setResponse(data.response);  
    }
    catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Error de red.");
    } 
    finally {
      setPrompt("");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Simulador de Agente GPT</h1>

      <div style={{ marginBottom: "1rem"}}>
        <label>
          Agent:
        </label>
        <select value={selectedAgent} onChange={(e) =>setSelectedAgent(e.target.value)} style={{ marginRight: "1rem"}}>
          {agents.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>

      {/*mostramos el historial del agente */}
      <div 
        style={{ border: "1px solid #ccc", 
          padding: "1rem", marginBottom: "1rem",
          maxHeight: "300px", overflowY: "auto",
        }}>
        {history[selectedAgent]?.map((msg, idx) => (
          <p key={idx}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "0.5rem 0",}}>
            <strong>
              {msg.sender === "user" ? "Tú" : selectedAgent}:
            </strong>{" "}
            {msg.content}
          </p>
        ))}
      </div>   
      <div>
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
      </div>
      

      {/*{response && <p> <strong>Respuesta:</strong> {response} </p>}*/}
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
          </p>
        )}
    </main>
  );

}
