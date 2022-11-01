// apis
import type {
  CreateCategoryBody,
  CreateProductBody,
  DeleteCategoryParams,
  DeleteProductParams,
  UpdateCategoryBody,
  UpdateCategoryParams,
  UpdateProductBody,
  UpdateProductParams,
} from '../../apis/productApi';

export const GET_CATEGORIES = 'GET_CATEGORIES';

export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const GET_PRODUCTS = 'GET_PRODUCTS';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const GET_WARRANTIES = 'GET_WARRANTIES';
export const GET_SPECIFICATIONS = 'GET_SPECIFICATIONS';

export interface GetCategoriesPayload {}
export const getCategoriesAction = (payload: GetCategoriesPayload) => {
  return {
    type: GET_CATEGORIES,
    payload,
  };
};
export interface CreateCategoryPayload extends CreateCategoryBody {}
export const createCategoryAction = (payload: CreateCategoryPayload) => {
  return {
    type: CREATE_CATEGORY,
    payload,
  };
};
export type UpdateCategoryPayload = UpdateCategoryParams & UpdateCategoryBody;
export const updateCategoryAction = (payload: UpdateCategoryPayload) => {
  return {
    type: UPDATE_CATEGORY,
    payload,
  };
};
export type DeleteCategoryPayload = DeleteCategoryParams;
export const deleteCategoryAction = (payload: DeleteCategoryPayload) => {
  return {
    type: DELETE_CATEGORY,
    payload,
  };
};
export interface GetProductsPayload {}
export const getProductsAction = (payload: GetProductsPayload) => {
  return {
    type: GET_PRODUCTS,
    payload,
  };
};
export interface CreateProductPayload extends CreateProductBody {}
export const createProductsAction = (payload: CreateProductPayload) => {
  return {
    type: CREATE_PRODUCT,
    payload,
  };
};
export type UpdateProductPayload = UpdateProductParams & UpdateProductBody;
export const updateProductAction = (payload: UpdateProductPayload) => {
  return {
    type: UPDATE_PRODUCT,
    payload,
  };
};
export type DeletProductPayload = DeleteProductParams;
export const deleteProductAction = (payload: DeletProductPayload) => {
  return {
    type: DELETE_PRODUCT,
    payload,
  };
};

export interface GetWarrantiesPayload {}
export const getWarrantiessAction = (payload: GetWarrantiesPayload) => {
  return {
    type: GET_WARRANTIES,
    payload,
  };
};

export interface GetSpecificationsPayload {}
export const getSpecificationsAction = (payload: GetSpecificationsPayload) => {
  return {
    type: GET_SPECIFICATIONS,
    payload,
  };
};
