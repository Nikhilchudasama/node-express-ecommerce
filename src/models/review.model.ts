export type CreateReviewInput = {
  rating: number;
  title?: string;
  comment?: string;
};

export type ReviewResponse = {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
};
