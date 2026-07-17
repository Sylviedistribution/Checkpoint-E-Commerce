import mongoose from "mongoose";

export const connectDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI manquant dans le fichier .env");
  }
  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connecté : ${connection.connection.host}`);
  return connection;
};
