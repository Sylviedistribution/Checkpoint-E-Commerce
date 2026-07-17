export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route introuvable : ${req.originalUrl}` });
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Erreur interne du serveur";
  if (process.env.NODE_ENV !== "test") {
    console.error(`[${statusCode}]`, message);
  }
  res.status(statusCode).json({ message });
};
