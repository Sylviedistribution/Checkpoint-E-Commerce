import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { extractErrorMessage } from "../api/client.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>Créer un compte</h1>
      <label htmlFor="name">Nom</label>
      <input id="name" required value={form.name} onChange={updateField("name")} />
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required value={form.email} onChange={updateField("email")} />
      <label htmlFor="password">Mot de passe (6 caractères min.)</label>
      <input
        id="password"
        type="password"
        required
        minLength={6}
        value={form.password}
        onChange={updateField("password")}
      />
      {error && <p className="page-status error">{error}</p>}
      <button type="submit" className="button-primary">
        Créer mon compte
      </button>
      <p>
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </form>
  );
}
