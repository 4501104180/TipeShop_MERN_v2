import { message } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
//apis
import { FindAllOrderResponse } from '../../apis/orderApi';
import orderApi from '../../apis/orderApi';
//models
import type { Order } from '../../models';
// redux
import { RootState } from '../store';
import { GET_ORDERS, GetOrdersPayload, UPDATE_ORDER } from '../actions/order';
import { UpdateOrderPayload } from '../actions/order';
import { UpdateOrderResponse } from '../../apis/orderApi';

export interface OrderState {
  isLoading: boolean;
  error: string | undefined;
  lastAction: 'update' | undefined;
  orders: Order[];
}
const initialState: OrderState = {
  isLoading: false,
  error: undefined,
  lastAction: undefined,
  orders: [],
};

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
      state.error = undefined;
      state.lastAction = undefined;
    },
    actionSuccess: (state, action: PayloadAction<OrderState['lastAction']>) => {
      state.isLoading = false;
      state.error = undefined;
      state.lastAction = action.payload;
    },
    hasError: (state, action: PayloadAction<OrderState['error']>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAction: (state) => {
      state.lastAction = undefined;
      state.isLoading = false;
      state.error = undefined;
    },
    getOrdersSuccess: (state, action: PayloadAction<FindAllOrderResponse>) => {
      const { data } = action.payload;
      state.orders = data;
    },
    updateOrdersSuccess: (state, action: PayloadAction<Order>) => {
      const orderUpdate = action.payload;
      const { _id } = orderUpdate;
      state.orders = state.orders.map((order) => (order._id === _id ? orderUpdate : order));
    },
  },
});

const { reducer, actions } = slice;
export const { clearAction } = actions;
export const selectOrders = (state: RootState) => state.order;
export default reducer;

function* getOrders(action: PayloadAction<GetOrdersPayload>) {
  try {
    yield put(actions.startLoading());
    const response: FindAllOrderResponse = yield call(orderApi.findAllOrder);
    const { data } = response;
    yield put(actions.getOrdersSuccess({ data }));
    yield put(actions.actionSuccess());
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error(error.response?.statusText);
    }
  }
}
function* updateOrders(action: PayloadAction<UpdateOrderPayload>) {
  try {
    yield put(actions.startLoading());
    const { _id, ...values } = action.payload;
    const response: UpdateOrderResponse = yield call(orderApi.update, { _id }, values);
    const { order, msg } = response;
    yield put(actions.updateOrdersSuccess(order));
    yield put(actions.actionSuccess('update'));
    message.success({ content: msg, key: 'update' });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(actions.hasError(error.response?.statusText));
      message.error({ content: error.response?.statusText, key: 'update' });
    }
  }
}
export function* orderSaga() {
  yield takeEvery(GET_ORDERS, getOrders);

  yield takeLatest(UPDATE_ORDER, updateOrders);
}
