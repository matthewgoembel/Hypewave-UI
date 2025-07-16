import { useState, useContext } from "react";
import { login as apiLogin, getMe } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginPage({ onClose }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { access_token } = await apiLogin(email, password);
      const user = await getMe(access_token);
      login(access_token, user);
      onClose();
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <img src="/eyes_logo.svg" alt="Hypewave" className="w-32 h-32 mb-4" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-3 text-left"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 rounded bg-panel text-white placeholder-primary/60"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-3 py-2 rounded bg-panel text-white placeholder-primary/60"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary py-2 rounded text-sm font-semibold hover:bg-primary/80"
        >
          Sign In
        </button>
      </form>

      <button
        onClick={onClose}
        className="mt-4 text-sm text-primary/70 hover:underline"
      >
        Continue as Guest
      </button>
    </div>
  );
}
