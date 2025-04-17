import { MongoClient, ObjectId } from "mongodb";

import { Router } from "express";



const productRouter = Router();

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dbName = "practice-mongo";
let db;

client.connect()
  .then(() => {
    db = client.db(dbName);
    console.log("Connected to database:", dbName);
  })
  .catch((err) => console.error("Database connection failed:", err));

productRouter.get("/", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});


productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: product });
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
});


productRouter.post("/", async (req, res) => {
  const { name, price, image, description, category } = req.body;
  try {
    const result = await db.collection("products").insertOne({
      name,
      price,
      image,
      description,
      category,
    });
    res.status(201).json({ message: "Product has been created successfully"});
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
});

// id ยาวมากเพื่อให้ตรงตามเงื่อนไข ตัวอย่าง id เช่น 6800c489d82fa903fa715234
productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, image, description, category } = req.body;
  try {
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, price, image, description, category } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product has been updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
});


productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product has been deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err); // 👈
    res.status(500).json({ message: "Error deleting product", error: err });
  }
});

export default productRouter;
