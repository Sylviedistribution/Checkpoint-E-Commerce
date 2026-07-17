import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient, { extractErrorMessage } from "../api/client.js";
import { formatPrice } from "../hooks/useFormatPrice.js";

const STATUS_LABELS = {
  pending: "En attente",
  paid: "Payée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState({ isLoading: true, error: "" });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get("/orders/mine");
        setOrders(data.orders);
        setStatus({ isLoading: false, error: "" });
      } catch (error) {
        setStatus({ isLoading: false, error: extractErrorMessage(error) });
      }
    };
    fetchOrders();
  }, []);

  if (status.isLoading) return <p className="page-status">Chargement de vos commandes…</p>;
  if (status.error) return <p className="page-status error">{status.error}</p>;

  return (
    <section className="orders-page">
      <h1>Mes commandes</h1>
      {location.state?.newOrderId && (
        <p className="page-status success">Commande confirmée. Merci pour votre achat !</p>
      )}
      {orders.length === 0 && <p>Vous n'avez pas encore passé de commande.</p>}
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order._id} className="order-card">
            <header>
              <span className="order-id">Commande n° {order._id.slice(-8).toUpperCase()}</span>
              <span className={`order-status status-${order.status}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </header>
            <p className="order-date">
              Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </p>
            <ul className="summary-list">
              {order.items.map((item) => (
                <li key={item._id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="cart-total">
              Total : <strong>{formatPrice(order.totalPrice)}</strong>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
