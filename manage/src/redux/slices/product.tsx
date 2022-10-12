import { message } from 'antd';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// apis
import type {
  CreateCategoryResponse,
  CreateProductResponse,
  DeleteCategoryResponse,
  DeleteProductResponse,
  FindAllCategoriesResponse,
  FindAllProductsResponse,
  UpdateCategoryResponse,
  UpdateProductResponse,
} from '../../apis/productApi';
import productApi from '../../apis/productApi';
// models
import type { Category, Product } from '../../models';
// redux
import { RootState } from '../store';
import {
  CreateCategoryPayload,
  CreateProductPayload,
  CREATE_CATEGORY,
  CREATE_PRODUCT,
  DeleteCategoryPayload,
  DELETE_CATEGORY,
  DELETE_PRODUCT,
  DeletProductPayload,
  GetProductsPayload,
  GET_PRODUCTS,
  UpdateCategoryPayload,
  UpdateProductPayload,
  UPDATE_CATEGORY,
  UPDATE_PRODUCT,
} from '../actions/product';
import { GET_CATEGORIES } from '../actions/product';

export interface ProductState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'create' | 'update' | 'delete' | undefined;
  categories: Category[];
  products: Product[];
}
const initialState: ProductState = {
  isLoading: false,
  error: undefined,
  lastAction: undefined,
  categories: [],
  products: [],
};
const categoriesChanged = (
  categories: Category[],
  target: Category
): ProductState['categories'] => {
  // prevent target duplicate if the target becomes a child
  const categoriesFormated = categories.filter(
    (category) => !(category._id === target._id && !category.parent_id)
  );
  return categoriesFormated.map((category) => {
    const { _id, children } = category;
    const isCategoryHasTarget = children && children.find((e) => e._id === target._id);
    if (isCategoryHasTarget) {
      // update resource if target is one of children
      const isCategoryOwnsTarget = target.parent_id === _id;
      if (isCategoryOwnsTarget)
        // update matched target
        return { ...category, children: children.map((e) => (e._id === target._id ? target : e)) };
      // remove target if resource not owns target anymore (case of update target's parent)
      return { ...category, children: children.filter((e) => e._id !== target._id) };
    } else if (target.parent_id === _id)
      // add target to matched resource
      return {
        ...category,
        children: children ? [...categoriesChanged(children, target), target] : [target],
      };
    else if (children && children.length > 0)
      // recursive for children
      return { ...category, children: categoriesChanged(children, target) };
    return category;
  });
};
const newCategoryByCategory = (
  categories: Category[],
  target: Category
): ProductState['categories'] => {
  const isRootTarget = target.parent_id === null;
  const rs = categoriesChanged(categories, target);
  return isRootTarget ? [...rs, target] : rs;
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = undefined;
      state.lastAction = undefined;
    },
    actionSuccess: (state, action: PayloadAction<ProductState['lastAction']>) => {
      state.isLoading = false;
      state.error = undefined;
      state.lastAction = action.payload;
    },
    hasError: (state, action: PayloadAction<ProductState['error']>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAction: (state) => {
      state.lastAction = undefined;
      state.isLoading = false;
      state.error = undefined;
    },
    getCategoriesSuccess: (state, action: PayloadAction<FindAllCategoriesResponse>) => {
      const { data } = action.payload;
      state.categories = data;
    },
    createCategorySuccess: (state, action: PayloadAction<Category>) => {
      const category = action.payload;
      state.categories = newCategoryByCategory(current(state.categories), category);
    },
    updateCategorySuccess: (state, action: PayloadAction<Category>) => {
      const category = action.payload;
      state.categories = newCategoryByCategory(current(state.categories), category);
    },
    deleteCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.categories = state.categories.filter((category) => category !== action.payload);
    },
    getProductsSucess: (state, action: PayloadAction<FindAllProductsResponse>) => {
      const { data } = action.payload;
      state.products = data;
    },
    createProductsSucess: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.products = [...state.products, product];
    },
    updateProductsSucess: (state, action: PayloadAction<Product>) => {
      const productUpdate = action.payload;
      const { _id } = productUpdate;
      state.products = state.products.map((product) =>
        product._id === _id ? productUpdate : product
      );
    },
    deleteProductSuccess: (state, action: PayloadAction<Product>) => {
      state.products = state.products.filter((product) => product._id !== action.payload._id);
    },
  },
});
const { reducer, actions } = slice;
export const { clearAction } = actions;
export const selectProduct = (state: RootState) => state.product;
// export const productActions = actions;
export default reducer;

function* getCategories() {
  try {
    yield put(actions.startLoading());
    const response: FindAllCategoriesResponse = yield call(productApi.findAllCategories);
    const { data } = response;
    yield put(actions.getCategoriesSuccess({ data }));
    yield put(actions.actionSuccess());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error(error.response?.statusText);
    }
  }
}
function* createCategory(action: PayloadAction<CreateCategoryPayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateCategoryResponse = yield call(productApi.createCategory, action.payload);
    const { category, msg } = response;
    yield put(actions.createCategorySuccess(category));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'create' });
    }
  }
}
function* updateCategory(action: PayloadAction<UpdateCategoryPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateCategoryResponse = yield call(productApi.updateCategory, { _id }, values);
    const { category, msg } = response;
    yield put(actions.updateCategorySuccess(category));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}
function* deleteCategory(action: PayloadAction<DeleteCategoryPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id } = action.payload;
    const response: DeleteCategoryResponse = yield call(productApi.deleteCategory, { _id });
    const { category, msg } = response;
    yield put(actions.actionSuccess('delete'));
    yield put(actions.deleteCategorySuccess(category));
    message.success({ content: msg, key: 'delete' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}
function* getProducts(action: PayloadAction<GetProductsPayload>) {
  try {
    yield put(actions.startLoading());
    const response: FindAllProductsResponse = yield call(productApi.findAllProducts);
    const { data } = response;
    yield put(actions.getProductsSucess({ data }));
    yield put(actions.actionSuccess());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error(error.response?.statusText);
    }
  }
}
function* createProduct(action: PayloadAction<CreateProductPayload>) {
  try {
    yield put(actions.startLoading());
    const response: CreateProductResponse = yield call(productApi.createProduct, action.payload);
    const { product, msg } = response;
    yield put(actions.createProductsSucess(product));
    yield put(actions.actionSuccess('create'));
    message.success({ content: msg, key: 'create' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error(error.response?.statusText);
    }
  }
}
function* updateProduct(action: PayloadAction<UpdateProductPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateProductResponse = yield call(productApi.updateProduct, { _id }, values);
    const { product, msg } = response;
    yield put(actions.updateProductsSucess(product));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}
function* deleteProduct(action: PayloadAction<DeletProductPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id } = action.payload;
    const response: DeleteProductResponse = yield call(productApi.deleteProduct, { _id });
    const { product, msg } = response;
    yield put(actions.actionSuccess('delete'));
    yield put(actions.deleteProductSuccess(product));
    message.success({ content: msg, key: 'delete' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}
export function* productSaga() {
  yield takeEvery(GET_CATEGORIES, getCategories);

  yield takeLatest(CREATE_CATEGORY, createCategory);
  yield takeLatest(UPDATE_CATEGORY, updateCategory);
  yield takeLatest(DELETE_CATEGORY, deleteCategory);

  yield takeEvery(GET_PRODUCTS, getProducts);
  
  yield takeLatest(CREATE_PRODUCT, createProduct);
  yield takeLatest(UPDATE_PRODUCT, updateProduct);
  yield takeLatest(DELETE_PRODUCT, deleteProduct);
}
