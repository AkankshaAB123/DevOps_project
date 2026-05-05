import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔥 GET SUGGESTIONS
  const getSuggestion = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(API_URL, { message });

      console.log("API RESPONSE:", res.data);

      setSuggestions(res.data);

    } catch (err) {
      console.error("Frontend error:", err);
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SEND MESSAGE
  const sendMessage = (msg) => {
    if (!msg.trim()) return;

    setChat((prev) => [...prev, { text: msg, sender: "user" }]);
    setMessage("");
    setSuggestions(null);
  };

  return (
    <div className="app">

      <div className="header">💬 Chat Assistant</div>

      {/* CHAT */}
      <div className="chat-container">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`bubble ${msg.sender === "user" ? "right" : "left"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* SUGGESTIONS */}
      {suggestions && (
        <div className="suggestion-box">

          <div
            className="suggestion-card"
            onClick={() => sendMessage(suggestions.formal)}
          >
            <span>Formal</span>
            {suggestions.formal}
          </div>

          <div
            className="suggestion-card"
            onClick={() => sendMessage(suggestions.informal)}
          >
            <span>Informal</span>
            {suggestions.informal}
          </div>

        </div>
      )}

      {/* INPUT */}
      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />

        <button className="suggest-btn" onClick={getSuggestion}>
          {loading ? "Loading..." : "Suggest"}
        </button>

        <button className="send-btn" onClick={() => sendMessage(message)}>
          ➤
        </button>
      </div>

    </div>
  );
}

export default App;