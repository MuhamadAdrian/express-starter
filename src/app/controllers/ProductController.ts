import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { createProduct, getProduct, getProducts, removeProduct, updateProduct } from "../services/productService";

export class ProductController extends BaseController
{
// List all products with pagination
public static async index(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 10, search = "" } = req.query;
      const result = await getProducts({
        page: Number(page),
        pageSize: Number(pageSize),
        search: String(search),
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  }

  // Create a new product
  public static async store(req: Request, res: Response) {
    try {
      super.validate(req, res); // Assuming validate checks for the body structure

      const productData = req.body;
      const product = await createProduct(productData);

      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  }

  // View a single product by ID
  public static async view(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await getProduct(Number(id));

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  }

  // Update an existing product
  public static async update(req: Request, res: Response) {
    try {
      super.validate(req, res); // Assuming validate checks for the body structure

      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = await updateProduct(Number(id), productData);

      if (!updatedProduct) {
        res.status(404).json({ message: "Product not found" });
        return
      }

      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  }

  // Delete a product
  public static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await removeProduct(Number(id));

      if (!deleted) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  }
}