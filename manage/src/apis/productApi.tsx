import axiosInstance from './axiosInstance';

// models
import type { ListResponse, Category, StatusResponse, UploadFileType, Product } from '../models';
export interface CheckExistBody {
  names: Category['name'][];
}
export interface CheckExistResponse {
  exist: boolean;
}
export interface FindAllCategoriesResponse extends ListResponse<Category> {}

export interface CreateCategoryBody
  extends Omit<Category, '_id' | 'image' | 'banners' | 'children' | 'slug'> {
  image: UploadFileType;
  banners: UploadFileType[];
}
export interface CreateCategoryResponse extends StatusResponse {
  category: Category;
}

export interface UpdateCategoryParams extends Pick<Category, '_id'> {}
export interface UpdateCategoryBody
  extends Omit<Category, '_id' | 'image' | 'banners' | 'children' | 'slug'> {
  image: UploadFileType;
  banners: UploadFileType[];
}
export interface UpdateCategoryResponse extends CreateCategoryResponse {}

export interface DeleteCategoryParams extends Pick<Category, '_id'> {}
export interface DeleteCategoryResponse extends CreateCategoryResponse {}

export interface FindAllProductsResponse extends ListResponse<Product> {}
export interface CreateProductBody
  extends Omit<
    Product,
    '_id' | 'images' | 'slug' | 'attribute_values' | 'warranty_infor' | 'specifications'
  > {
  images: UploadFileType[];
}
export interface CreateProductResponse extends StatusResponse {
  product: Product;
}
export interface UpdateProductParams extends Pick<Product, '_id'> {}
export interface UpdateProductBody
  extends Omit<
    Product,
    '_id' | 'images' | 'slug' | 'attribute_values' | 'warranty_infor' | 'specifications'
  > {
  images: UploadFileType[];
}
export interface UpdateProductResponse extends CreateProductResponse {}

export interface DeleteProductParams extends Pick<Product, '_id'> {}
export interface DeleteProductResponse extends CreateProductResponse {}

const productApi = {
  // [GET] /categories
  findAllCategories: (): Promise<FindAllCategoriesResponse> => {
    const url = '/categories/findAllCategories';
    return axiosInstance.get(url);
  },
  // [POST] /categories/exist
  checkCategoriesExist: (body: CheckExistBody): Promise<CheckExistResponse> => {
    const url = `/categories/exist`;
    return axiosInstance.post(url, body);
  },
  // [POST] /categories
  createCategory: (body: CreateCategoryBody): Promise<CreateCategoryResponse> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'image' && typeof value !== 'string') formData.append('image', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/categories`;
    return axiosInstance.post(url, formData);
  },
  // [PUT] /categories/:_id
  updateCategory: (
    params: UpdateCategoryParams,
    body: UpdateCategoryBody
  ): Promise<UpdateCategoryResponse> => {
    const formData = new FormData();
    const { _id } = params;
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'image' && typeof value !== 'string') formData.append('image', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/categories/${_id}`;
    return axiosInstance.put(url, formData);
  },
  // [DELETE] /categories/:_id
  deleteCategory: (params: DeleteCategoryParams): Promise<DeleteCategoryResponse> => {
    const { _id } = params;
    const url = `/categories/${_id}`;
    return axiosInstance.delete(url);
  },

  // [GET] /products/
  findAllProducts: (): Promise<FindAllProductsResponse> => {
    const url = '/products';
    return axiosInstance.get(url);
  },

  // [POST] /products/
  createProduct: (body: CreateProductBody): Promise<CreateProductResponse> => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'image' && typeof value !== 'string') formData.append('image', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/products/`;
    return axiosInstance.post(url, formData);
  },
  // [PUT] /products/:_id
  updateProduct: (
    params: UpdateProductParams,
    body: UpdateProductBody
  ): Promise<UpdateProductResponse> => {
    const { _id } = params;
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value) {
        if (key === 'image' && typeof value !== 'string') formData.append('image', value.file);
        else if (value instanceof Array) value.map((e) => formData.append(key, e));
        else formData.append(key, value);
      }
    });
    const url = `/products/${_id}`;
    return axiosInstance.put(url, formData);
  },
  // [DELETE] /products/:_id
  deleteProduct: (params: DeleteProductParams): Promise<DeleteProductResponse> => {
    const { _id } = params;
    const url = `/products/${_id}`;
    return axiosInstance.delete(url);
  },
};
export default productApi;
