import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch (err) {
      alert("Prijava ni uspela: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Prijava</h2>
      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Geslo"
        className="border w-full p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 w-full hover:bg-blue-700"
      >
        Prijavi se
      </button>
    </form>
  );
}
