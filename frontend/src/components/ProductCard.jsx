import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../hooks/useFormatPrice.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/produits/${product._id}`} className="product-card-media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder" aria-hidden="true" />
        )}
      </Link>
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>
          <Link to={`/produits/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="button-primary"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </button>
      </div>
    </article>
  );
}
