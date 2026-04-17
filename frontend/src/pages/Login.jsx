/*import { useState } from "react";

export default function Login({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("username", name);
    setUser(name);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[320px] text-center">

        <h1 className="text-3xl font-bold mb-6 text-white">
          💬 Chat App
        </h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-lg bg-black/40 text-white outline-none mb-4 focus:ring-2 focus:ring-white"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          Enter →
        </button>

      </div>
    </div>
  );
}*/
export default function App() {
  return <h1>HELLO TEST</h1>;
}