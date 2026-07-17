import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        Boutik<span className="brand-dot">.</span>
      </Link>
      <nav className="main-nav">
        <NavLink to="/">Catalogue</NavLink>
        <NavLink to="/panier" className="cart-link">
          Panier
          {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
        </NavLink>
        {user ? (
          <>
            <NavLink to="/mes-commandes">Mes commandes</NavLink>
            <button type="button" className="link-button" onClick={handleLogout}>
              Se déconnecter ({user.name})
            </button>
          </>
        ) : (
          <>
            <NavLink to="/connexion">Connexion</NavLink>
            <NavLink to="/inscription" className="nav-cta">
              Créer un compte
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
