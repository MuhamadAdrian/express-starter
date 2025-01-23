import { AppDataSource } from "../../database";
import { Product } from "../models/Product";
import { Like } from "typeorm";

export const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (body: { name: string; description: string; category_id: number }) => {
    const product = productRepository.create({
        name: body.name,
        description: body.description,
        productCategory: { id: body.category_id },
    });

    return await productRepository.save(product)
};

export const updateProduct = async (id: number, body: { name: string; description: string; category_id: number }) => {
    const product = await productRepository.update({
        id
    }, {
        name: body.name,
        description: body.description,
        productCategory: {id: body.category_id}
    })

    return product;
}

export const getProduct = (id: number) => {
    const product = productRepository.findOneByOrFail({
        id
    })

    return product
}

export const getProducts = async ({ page = 1, pageSize = 10, search = "" }: { page?: number; pageSize?: number; search?: string }) => {
  try {
    const [products, total] = await productRepository.findAndCount({
      where: search ? { name: Like(`%${search}%`) } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: products,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const removeProduct = async (id: number) => {
    return await productRepository.delete({
        id
    })
}