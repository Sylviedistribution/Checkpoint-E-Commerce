import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../hooks/useFormatPrice.js";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h1>Votre panier est vide</h1>
        <p>Ajoutez des produits depuis le catalogue pour les retrouver ici.</p>
        <Link to="/" className="button-primary">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section>
        <h1>Votre panier</h1>
        <ul className="cart-list">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              {item.imageUrl && <img src={item.imageUrl} alt="" />}
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">{formatPrice(item.price)}</p>
              </div>
              <select
                value={item.quantity}
                aria-label={`Quantité pour ${item.name}`}
                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
              >
                {Array.from({ length: Math.min(item.stock || 10, 10) }, (_, index) => index + 1).map(
                  (value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
              <button
                type="button"
                className="link-button danger"
                onClick={() => removeItem(item.productId)}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>
      <aside className="cart-summary">
        <h2>Récapitulatif</h2>
        <p className="cart-total">
          Total : <strong>{formatPrice(totalPrice)}</strong>
        </p>
        <button type="button" className="button-primary" onClick={() => navigate("/commande")}>
          Passer la commande
        </button>
      </aside>
    </div>
  );
}
