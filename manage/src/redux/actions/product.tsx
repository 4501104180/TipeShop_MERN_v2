// apis
import type { CreateCategoryBody, DeleteCategoryParams, UpdateCategoryBody, UpdateCategoryParams } from '../../apis/productApi';

export const GET_CATEGORIES = 'GET_CATEGORIES';

export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

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
