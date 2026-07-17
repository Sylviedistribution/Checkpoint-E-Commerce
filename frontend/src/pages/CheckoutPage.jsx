import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { extractErrorMessage } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../hooks/useFormatPrice.js";

const EMPTY_ADDRESS = { fullName: "", street: "", city: "", postalCode: "", country: "" };

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [status, setStatus] = useState({ isSubmitting: false, error: "" });

  const updateAddressField = (field) => (event) =>
    setShippingAddress({ ...shippingAddress, [field]: event.target.value });

  const submitOrder = async (event) => {
    event.preventDefault();
    setStatus({ isSubmitting: true, error: "" });
    try {
      const payload = {
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
        shippingAddress,
        paymentMethod,
      };
      const { data } = await apiClient.post("/orders", payload);
      clearCart();
      navigate("/mes-commandes", { state: { newOrderId: data.order._id } });
    } catch (error) {
      setStatus({ isSubmitting: false, error: extractErrorMessage(error) });
    }
  };

  if (items.length === 0) {
    return <p className="page-status">Votre panier est vide : rien à commander.</p>;
  }

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={submitOrder}>
        <h1>Finaliser la commande</h1>

        <fieldset>
          <legend>Adresse de livraison</legend>
          <label htmlFor="fullName">Nom complet</label>
          <input id="fullName" required value={shippingAddress.fullName} onChange={updateAddressField("fullName")} />
          <label htmlFor="street">Adresse</label>
          <input id="street" required value={shippingAddress.street} onChange={updateAddressField("street")} />
          <div className="form-row">
            <div>
              <label htmlFor="city">Ville</label>
              <input id="city" required value={shippingAddress.city} onChange={updateAddressField("city")} />
            </div>
            <div>
              <label htmlFor="postalCode">Code postal</label>
              <input id="postalCode" required value={shippingAddress.postalCode} onChange={updateAddressField("postalCode")} />
            </div>
          </div>
          <label htmlFor="country">Pays</label>
          <input id="country" required value={shippingAddress.country} onChange={updateAddressField("country")} />
        </fieldset>

        <fieldset>
          <legend>Mode de paiement</legend>
          {[
            { value: "cash_on_delivery", label: "Paiement à la livraison" },
            { value: "card", label: "Carte bancaire (Stripe)" },
            { value: "paypal", label: "PayPal" },
          ].map((option) => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={paymentMethod === option.value}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        {status.error && <p className="page-status error">{status.error}</p>}
        <button type="submit" className="button-primary" disabled={status.isSubmitting}>
          {status.isSubmitting ? "Envoi de la commande…" : `Commander (${formatPrice(totalPrice)})`}
        </button>
      </form>

      <aside className="cart-summary">
        <h2>Votre commande</h2>
        <ul className="summary-list">
          {items.map((item) => (
            <li key={item.productId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="cart-total">
          Total : <strong>{formatPrice(totalPrice)}</strong>
        </p>
      </aside>
    </div>
  );
}
