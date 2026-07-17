import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { extractErrorMessage } from "../api/client.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(credentials.email, credentials.password);
      navigate(location.state?.from || "/");
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Connexion</h1>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        required
        value={credentials.email}
        onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
      />
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        required
        value={credentials.password}
        onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
      />
      {error && <p className="page-status error">{error}</p>}
      <button type="submit" className="button-primary">
        Se connecter
      </button>
      <p>
        Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </form>
  );
}
