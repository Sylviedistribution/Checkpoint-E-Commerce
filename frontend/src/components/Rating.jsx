export default function Rating({ value, reviewCount }) {
  const roundedValue = Math.round(value);
  const stars = "★★★★★".slice(0, roundedValue).padEnd(5, "☆");
  return (
    <p className="rating" aria-label={`Note moyenne ${value} sur 5`}>
      <span className="rating-stars">{stars}</span>
      {typeof reviewCount === "number" && (
        <span className="rating-count">({reviewCount} avis)</span>
      )}
    </p>
  );
}
