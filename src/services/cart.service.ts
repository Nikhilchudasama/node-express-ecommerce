import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import type { CartItemInput, CartUpdateItemInput } from '../models/cart.model';
import type { CartRepositoryLike } from '../repositories/cart.repository';
import type { ProductRepositoryLike } from '../repositories/product.repository';

export class CartService {
  constructor(
    private readonly cartRepository: CartRepositoryLike,
    private readonly productRepository: Pick<ProductRepositoryLike, 'findById'>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      await this.cartRepository.createCart(userId);
      cart = await this.cartRepository.findCartByUserId(userId);

      if (!cart) {
        throw new ApiError(500, 'Failed to create cart');
      }
    }

    return { cart };
  }

  async addItem(userId: string, input: CartItemInput) {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    let cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      await this.cartRepository.createCart(userId);
      cart = await this.cartRepository.findCartByUserId(userId);
      if (!cart) {
        throw new ApiError(500, 'Failed to create cart');
      }
    }

    const item = await this.cartRepository.addItem(cart.id, {
      ...input,
      price: new Prisma.Decimal(product.price),
    });
    return { item };
  }

  async updateItem(userId: string, productId: number, input: CartUpdateItemInput) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    const item = await this.cartRepository.updateItem(cart.id, productId, input);
    return { item };
  }

  async removeItem(userId: string, productId: number) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    await this.cartRepository.removeItem(cart.id, productId);
    return { message: 'Item removed from cart' };
  }

  async clear(userId: string) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    await this.cartRepository.clearCart(cart.id);
    return { message: 'Cart cleared successfully' };
  }
}
