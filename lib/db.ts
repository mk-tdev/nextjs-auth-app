import { MongoClient } from "mongodb";

export const connectToDB = async () => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_host}/${process.env.mongodb_database}?retryWrites=true&w=majority`
    );
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
