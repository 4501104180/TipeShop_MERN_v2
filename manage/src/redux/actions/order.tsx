// apis
import type { CreateOrderBody, UpdateOrderBody, UpdateOrderParams } from '../../apis/orderApi';

export const GET_ORDERS = 'GET_ORDERS';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export interface GetOrdersPayload {}
export const getOrdersAction = (payload: GetOrdersPayload) => {
  return {
    type: GET_ORDERS,
    payload,
  };
};
export interface CreateOrderPayload extends CreateOrderBody {}
export type UpdateOrderPayload = UpdateOrderParams & UpdateOrderBody;
export const updateOrderAction = (payload: UpdateOrderPayload) => {
  return {
    type: UPDATE_ORDER,
    payload,
  };
};
