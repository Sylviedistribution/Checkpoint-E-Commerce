import { useEffect, useState } from "react";
import apiClient, { extractErrorMessage } from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["Toutes", "Électronique", "Accessoires", "Sport", "Maison"];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [status, setStatus] = useState({ isLoading: true, error: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      setStatus({ isLoading: true, error: "" });
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category !== "Toutes") params.category = category;
        const { data } = await apiClient.get("/products", { params });
        setProducts(data.products);
        setStatus({ isLoading: false, error: "" });
      } catch (error) {
        setStatus({ isLoading: false, error: extractErrorMessage(error) });
      }
    };
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">Boutique en ligne</p>
        <h1>Des produits utiles, livrés chez vous.</h1>
        <p className="hero-subtitle">
          Parcourez le catalogue, ajoutez au panier et commandez en quelques clics.
        </p>
      </section>

      <section className="catalog-toolbar">
        <input
          type="search"
          value={search}
          placeholder="Rechercher un produit…"
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Rechercher un produit"
        />
        <div className="category-filters" role="group" aria-label="Filtrer par catégorie">
          {CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              className={label === category ? "chip chip-active" : "chip"}
              onClick={() => setCategory(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {status.isLoading && <p className="page-status">Chargement du catalogue…</p>}
      {status.error && <p className="page-status error">{status.error}</p>}
      {!status.isLoading && !status.error && products.length === 0 && (
        <p className="page-status">Aucun produit ne correspond à votre recherche.</p>
      )}

      <section className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </>
  );
}
