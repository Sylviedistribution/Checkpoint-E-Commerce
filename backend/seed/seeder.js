import dotenv from "dotenv";
import { connectDatabase } from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const sampleProducts = [
  { name: "Casque audio sans fil", description: "Casque Bluetooth avec réduction de bruit active et 30h d'autonomie.", price: 45000, category: "Électronique", stock: 25, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
  { name: "Montre connectée Sport", description: "Suivi d'activité, GPS intégré, étanche jusqu'à 50 m.", price: 32000, category: "Électronique", stock: 40, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
  { name: "Sac à dos urbain", description: "Sac 25 L résistant à l'eau avec compartiment ordinateur 15\".", price: 18000, category: "Accessoires", stock: 60, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600" },
  { name: "Chaussures de course", description: "Semelle amortissante, tige respirante, idéales pour l'entraînement.", price: 27500, category: "Sport", stock: 35, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
  { name: "Lampe de bureau LED", description: "Intensité réglable, port USB de charge, bras articulé.", price: 12000, category: "Maison", stock: 50, imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600" },
  { name: "Cafetière à piston", description: "Cafetière en verre borosilicate 1 L, filtre inox réutilisable.", price: 9500, category: "Maison", stock: 45, imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600" },
  { name: "Clavier mécanique", description: "Switchs tactiles, rétroéclairage, format compact 75 %.", price: 38000, category: "Électronique", stock: 20, imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600" },
  { name: "Gourde isotherme 750 ml", description: "Garde vos boissons froides 24 h ou chaudes 12 h.", price: 7000, category: "Sport", stock: 80, imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600" }
];

const adminAccount = {
  name: "Admin",
  email: "admin@shop.local",
  password: "admin123",
  role: "admin",
};

const seedDatabase = async () => {
  await connectDatabase(process.env.MONGO_URI);
  await Promise.all([Product.deleteMany(), User.deleteMany({ email: adminAccount.email })]);
  await Product.insertMany(sampleProducts);
  await User.create(adminAccount);
  console.log("Base de données initialisée : 8 produits + compte admin (admin@shop.local / admin123)");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error("Échec du seed :", error.message);
  process.exit(1);
});
