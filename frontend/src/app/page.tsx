'use client'

import { useEffect, useState } from "react";

// tipos de mensajes
type Message = {
  sender: "user" | "agent";
  content: string;
};
type BroadcastResponses = Record<string, string>;


export default function HomePage() {
  const [agents, setAgents] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [newAgent, setNewAgent] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<Record<string, Message[]>>({}); // historial local
// Broadcast states
  const [broadcastPrompt, setBroadcastPrompt] = useState<string>("");
  const [broadcastResponses, setBroadcastResponses] = useState<BroadcastResponses>({});
  const [broadcastError, setBroadcastError] = useState<string>("");

const reloadAgents = async () => {
  try {
    setError("");
    const res = await fetch("http://127.0.0.1:8000/agents");
    if (!res.ok) throw new Error("No se pudo obtener la lista de agentes");
    const data: string[] = await res.json();
    setAgents(data);
    if (data.length && !data.includes(selectedAgent)) {
      setSelectedAgent(data[0]);
    }
    //Ajuste de Historial
    setHistory((prev) => {
      const updated: Record<string, Message[]> = {};
      data.forEach((ag) => (updated[ag] = prev[ag] || []));
      return updated;
    });
  }
    catch(err:any) {
    console.error(err);
    setError(err.message);
    }
  };

  useEffect(() => {
    reloadAgents();
  }, []);

// Creación de nuevo agente
  const handleCreateAgent = async () => {
    if (!newAgent.trim()) {
      setError("El nombre de agente no puede estar vacío");
      return;
    }
    try {
      setError("");
      const res = await fetch("http://127.0.0.1:8000/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAgent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al crear agente");
      setNewAgent("");
      await reloadAgents();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

//Eliminación de agentes
  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;
    try {
      setError("");
      const res = await fetch(
        `http://127.0.0.1:8000/agents/${selectedAgent}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al eliminar agente");
      await reloadAgents();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

// Enviar prompt a un agente
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("El mensaje no puede estar vacio");
      return;
    }
    setError("");
    //Agregar mensajes del ususario al historias
    setHistory((prev) => ({
      ...prev,
      [selectedAgent]: [
        ...prev[selectedAgent],
        { sender: "user", content: prompt },
      ],
    }));    
    
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Error al enviar prompt");
    }

    //Agregar respuestas del agente al historial
    setHistory((prev) => ({
      ...prev,
      [selectedAgent]: [
        ...prev[selectedAgent],
        { sender: "agent", content: data.response },
      ],
    }));
    }
    
    catch (err: any) {
      console.error(err);
      setError(err.message || "Error al llamar al endpoint /chat");
    } 
    finally {
      setPrompt("");
    }
  };


// Broadcast a todos los agentes
  const handleBroadcast = async () => {
    if (!broadcastPrompt.trim()) {
      setBroadcastError("El mensaje de broadcast no puede estar vacío.");
      return;
      } 
    setBroadcastError("");
    setBroadcastResponses({});


    try {
      const res = await fetch("http://127.0.0.1:8000/agents/broadcast", {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({prompt: broadcastPrompt}),
      });
      const data: {response: BroadcastResponses} = await res.json();
      if (!res.ok) throw new Error(data.response ? "" : "Error en broadcast");
      setBroadcastResponses(data.response);
    }
    catch (err: any) {
      console.error(err);
      setBroadcastError(err.message || "Error al hacer broascast.");
    }
    finally {
      setBroadcastPrompt("");
    }
  }

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
      <input
          type="text"
          placeholder="Nuevo agente"
          value={newAgent}
          onChange={(e) => setNewAgent(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleCreateAgent}>Crear agente</button>
        <button
          onClick={handleDeleteAgent}
          style={{ marginLeft: "1rem", color: "red" }}
        >
          Eliminar agente
        </button>
      </div>
      {/* Historial de conversacion*/}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          margin: "1rem 0",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {history[selectedAgent]?.map((msg, i) => (
          <p
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "0.5rem 0",
            }}
          >
            <strong>
              {msg.sender === "user" ? "Tú" : selectedAgent}:
            </strong>{" "}
            {msg.content}
          </p>
        ))}
      </div>

      {/* Input y botón */}
      <div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe un mensaje"
          style={{ marginRight: "1rem", padding: "0.5rem", width: "60%" }}
        />
        <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem" }}>
          Enviar
        </button>
      </div>
      
      {/*Sección Broadcast */}
      <section style={{marginTop: "2rem"}}>
        <h2>
          Broadcast de agentes
        </h2>
        <div>
          <input 
            type="text"
            value={broadcastPrompt}
            onChange={(e) => setBroadcastPrompt(e.target.value)}
            placeholder="Escribe prompt de broadcast"
            style={{ marginRight: "1rem", padding: "0.5rem", width: "60%" }}
          />
          <button onClick={handleBroadcast} style={{ padding: "0.5rem 1rem" }}>
            Broadcast
          </button>
        </div>

        {broadcastError && (
          <p style={{ color: "red", marginTop: "1rem" }}>
            <strong>Error:</strong> {broadcastError}
          </p>
        )}

        {Object.keys(broadcastResponses).length > 0 && (
          <div 
            style={{
              border: "1px solid #888",
              padding: "1rem",
              marginTop: "1rem",
            }}>
              {Object.entries(broadcastResponses).map(
                ([agent, resp], idx) => (
                  <p key={idx} style={{margin:"0.5rem 0"}}>
                    <strong>{agent}:</strong> {resp}
                  </p>
                )
              )}
          </div>
        )}
      </section>

      {/*{response && <p> <strong>Respuesta:</strong> {response} </p>}*/}
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
          </p>
        )}
    </main>
  );

}
