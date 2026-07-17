import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient, { extractErrorMessage } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../hooks/useFormatPrice.js";
import Rating from "../components/Rating.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: "" });

  const loadProduct = async () => {
    try {
      const { data } = await apiClient.get(`/products/${id}`);
      setProduct(data.product);
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      const { data } = await apiClient.post(`/products/${id}/reviews`, reviewDraft);
      setProduct(data.product);
      setReviewDraft({ rating: 5, comment: "" });
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    }
  };

  if (error) return <p className="page-status error">{error}</p>;
  if (!product) return <p className="page-status">Chargement du produit…</p>;

  return (
    <article className="product-detail">
      <div className="product-detail-media">
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
      </div>
      <div className="product-detail-info">
        <p className="product-category">{product.category}</p>
        <h1>{product.name}</h1>
        <Rating value={product.averageRating} reviewCount={product.reviews.length} />
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-description">{product.description}</p>
        <p className={product.stock > 0 ? "stock-ok" : "stock-out"}>
          {product.stock > 0 ? `En stock : ${product.stock}` : "Rupture de stock"}
        </p>

        {product.stock > 0 && (
          <div className="add-to-cart-row">
            <label htmlFor="quantity">Quantité</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            >
              {Array.from({ length: Math.min(product.stock, 10) }, (_, index) => index + 1).map(
                (value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              )}
            </select>
            <button
              type="button"
              className="button-primary"
              onClick={() => addItem(product, quantity)}
            >
              Ajouter au panier
            </button>
          </div>
        )}

        <section className="reviews">
          <h2>Avis clients</h2>
          {product.reviews.length === 0 && <p>Aucun avis pour le moment.</p>}
          <ul>
            {product.reviews.map((review) => (
              <li key={review._id}>
                <Rating value={review.rating} />
                <p className="review-author">{review.authorName}</p>
                {review.comment && <p>{review.comment}</p>}
              </li>
            ))}
          </ul>

          {user ? (
            <form className="review-form" onSubmit={submitReview}>
              <h3>Laisser un avis</h3>
              <label htmlFor="rating">Note</label>
              <select
                id="rating"
                value={reviewDraft.rating}
                onChange={(event) =>
                  setReviewDraft({ ...reviewDraft, rating: Number(event.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
              <label htmlFor="comment">Commentaire</label>
              <textarea
                id="comment"
                rows="3"
                value={reviewDraft.comment}
                onChange={(event) =>
                  setReviewDraft({ ...reviewDraft, comment: event.target.value })
                }
              />
              <button type="submit" className="button-primary">
                Publier l'avis
              </button>
            </form>
          ) : (
            <p>
              <Link to="/connexion">Connectez-vous</Link> pour laisser un avis.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
