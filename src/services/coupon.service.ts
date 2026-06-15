import { ApiError } from '../utils/api-error';
import type { CreateCouponInput, UpdateCouponInput } from '../models/coupon.model';
import type { CouponRepositoryLike } from '../repositories/coupon.repository';

export class CouponService {
  constructor(private readonly couponRepository: CouponRepositoryLike) {}

  async list(page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      this.couponRepository.findMany((page - 1) * limit, limit),
      this.couponRepository.count(),
    ]);

    return {
      items,
      pagination: { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async getById(id: number) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    return { coupon };
  }

  async create(input: CreateCouponInput) {
    const existing = await this.couponRepository.findByCode(input.code);
    if (existing) {
      throw new ApiError(409, 'Coupon code already exists');
    }
    return { coupon: await this.couponRepository.create(input) };
  }

  async update(id: number, input: UpdateCouponInput) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }
    if (input.code !== undefined && input.code !== coupon.code) {
      const existing = await this.couponRepository.findByCode(input.code);
      if (existing) {
        throw new ApiError(409, 'Coupon code already exists');
      }
    }
    return { coupon: await this.couponRepository.update(id, input) };
  }

  async remove(id: number) {
    await this.getById(id);
    await this.couponRepository.delete(id);
    return { message: 'Coupon deleted successfully' };
  }

  async validate(code: string, cartTotal?: number) {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      throw new ApiError(404, 'Coupon not found');
    }

    const now = new Date();
    if (!coupon.isActive) {
      throw new ApiError(400, 'Coupon is inactive');
    }
    if (now < coupon.startsAt) {
      throw new ApiError(400, 'Coupon is not yet valid');
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      throw new ApiError(400, 'Coupon has expired');
    }
    if (coupon.maxUsageCount && coupon.usedCount >= coupon.maxUsageCount) {
      throw new ApiError(400, 'Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && cartTotal != null && cartTotal < Number(coupon.minOrderAmount)) {
      throw new ApiError(400, `Minimum order amount of $${coupon.minOrderAmount} not met`);
    }

    return { coupon, valid: true };
  }
}

export type CouponServiceLike = Pick<
  CouponService,
  'list' | 'getById' | 'create' | 'update' | 'remove' | 'validate'
>;
