export type CategoryListQuery = {
  search?: string;
  page?: string;
  limit?: string;
  sortOrder?: 'asc' | 'desc';
};

export type CategoryInput = {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
};

export type CategoryUpdateInput = Partial<CategoryInput>;

export type CategoryResponse = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
  parent: { id: number; name: string; slug: string } | null;
  _count: { products: number; children: number };
};
