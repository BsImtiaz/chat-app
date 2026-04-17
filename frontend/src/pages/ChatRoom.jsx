import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://chat-app-5s60.onrender.com");

export default function ChatRoom() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");

  const bottomRef = useRef();

  useEffect(() => {
    const messageHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", messageHandler);

    socket.on("typing", (user) => {
      setTyping(user);
      setTimeout(() => setTyping(""), 1000);
    });

    return () => {
      socket.off("message", messageHandler);
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const join = () => {
    if (!name.trim() || !room.trim()) return;
    socket.emit("joinRoom", { name, room });
    setJoined(true);
  };

  const send = () => {
    if (!msg.trim()) return;
    socket.emit("sendMessage", msg);
    setMsg("");
  };

  const handleTyping = (e) => {
    setMsg(e.target.value);
    socket.emit("typing", name);
  };

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔹 LOGIN SCREEN
  if (!joined) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2>Join Chat</h2>

          <input
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Enter room"
            onChange={(e) => setRoom(e.target.value)}
            style={styles.input}
          />

          <button onClick={join} style={styles.button}>
            Join
          </button>
        </div>
      </div>
    );
  }

  // 🔹 CHAT UI
  return (
    <div style={styles.container}>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        Room: {room} | {name}
      </div>

      {/* MESSAGES */}
      <div style={styles.chatBox}>
        {messages.map((m, i) => {
          const isMe =
            m.user?.trim().toLowerCase() ===
            name.trim().toLowerCase();

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isMe ? "#4f46e5" : "#e5e7eb",
                  color: isMe ? "white" : "black",
                  padding: "10px 14px",
                  borderRadius: "18px",
                  margin: "6px",
                  maxWidth: "260px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "11px", opacity: 0.6 }}>
                  {m.user}
                </div>

                <div>{m.text}</div>

                <div
                  style={{
                    fontSize: "10px",
                    textAlign: "right",
                    marginTop: "4px",
                    opacity: 0.6,
                  }}
                >
                  {getTime()}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* TYPING */}
      {typing && (
        <div style={{ padding: "5px", fontSize: "12px" }}>
          {typing} typing...
        </div>
      )}

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={msg}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type message..."
          style={styles.input}
        />

        <button onClick={send} style={styles.button}>
          Send
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f4f6f8",
  },

  navbar: {
    height: "60px",
    background: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    fontWeight: "600",
  },

  chatBox: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    gap: "10px",
    background: "white",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    padding: "10px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  loginBox: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
};