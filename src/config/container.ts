import { prisma } from './prisma';
import { UserRepository } from '../repositories/user.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { CartRepository } from '../repositories/cart.repository';
import { OrderRepository } from '../repositories/order.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { CouponRepository } from '../repositories/coupon.repository';
import { ProductImageRepository } from '../repositories/product-image.repository';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { ReviewService } from '../services/review.service';
import { CouponService } from '../services/coupon.service';
import { ProductImageService } from '../services/product-image.service';

class Container {
  readonly prisma = prisma;

  private _userRepository?: UserRepository;
  get userRepository() {
    if (!this._userRepository) this._userRepository = new UserRepository(this.prisma);
    return this._userRepository;
  }

  private _productRepository?: ProductRepository;
  get productRepository() {
    if (!this._productRepository) this._productRepository = new ProductRepository(this.prisma);
    return this._productRepository;
  }

  private _categoryRepository?: CategoryRepository;
  get categoryRepository() {
    if (!this._categoryRepository) this._categoryRepository = new CategoryRepository(this.prisma);
    return this._categoryRepository;
  }

  private _cartRepository?: CartRepository;
  get cartRepository() {
    if (!this._cartRepository) this._cartRepository = new CartRepository(this.prisma);
    return this._cartRepository;
  }

  private _orderRepository?: OrderRepository;
  get orderRepository() {
    if (!this._orderRepository) this._orderRepository = new OrderRepository(this.prisma);
    return this._orderRepository;
  }

  private _reviewRepository?: ReviewRepository;
  get reviewRepository() {
    if (!this._reviewRepository) this._reviewRepository = new ReviewRepository(this.prisma);
    return this._reviewRepository;
  }

  private _couponRepository?: CouponRepository;
  get couponRepository() {
    if (!this._couponRepository) this._couponRepository = new CouponRepository(this.prisma);
    return this._couponRepository;
  }

  private _productImageRepository?: ProductImageRepository;
  get productImageRepository() {
    if (!this._productImageRepository) this._productImageRepository = new ProductImageRepository(this.prisma);
    return this._productImageRepository;
  }

  private _authService?: AuthService;
  get authService() {
    if (!this._authService) this._authService = new AuthService(this.userRepository);
    return this._authService;
  }

  private _productService?: ProductService;
  get productService() {
    if (!this._productService) this._productService = new ProductService(this.productRepository);
    return this._productService;
  }

  private _categoryService?: CategoryService;
  get categoryService() {
    if (!this._categoryService) this._categoryService = new CategoryService(this.categoryRepository);
    return this._categoryService;
  }

  private _cartService?: CartService;
  get cartService() {
    if (!this._cartService) this._cartService = new CartService(this.cartRepository, this.productRepository);
    return this._cartService;
  }

  private _orderService?: OrderService;
  get orderService() {
    if (!this._orderService) this._orderService = new OrderService(this.orderRepository, this.cartRepository);
    return this._orderService;
  }

  private _reviewService?: ReviewService;
  get reviewService() {
    if (!this._reviewService) this._reviewService = new ReviewService(this.reviewRepository, this.productRepository);
    return this._reviewService;
  }

  private _couponService?: CouponService;
  get couponService() {
    if (!this._couponService) this._couponService = new CouponService(this.couponRepository);
    return this._couponService;
  }

  private _productImageService?: ProductImageService;
  get productImageService() {
    if (!this._productImageService) this._productImageService = new ProductImageService(this.productImageRepository, this.productRepository);
    return this._productImageService;
  }
}

export const container = new Container();
