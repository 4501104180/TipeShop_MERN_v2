import axiosInstance from './axiosInstance';
//model
import { ListResponse, Order, StatusResponse } from '../models';

export interface FindAllOrderResponse extends ListResponse<Order> {}

export interface FindOrderByIdParams extends Pick<Order, '_id'> {}
export interface FindOrderByIdResponse extends ListResponse<Order> {}

export interface UpdateOrderResponse extends StatusResponse {
  order: Order;
}
export interface CreateOrderBody extends Pick<Order, 'tracking_infor'> {}
export interface UpdateOrderParams extends Pick<Order, '_id'> {}
export interface UpdateOrderBody extends Pick<Order, 'tracking_infor'> {}

const orderApi = {
  // [GET] /orders/all
  findAllOrder: (): Promise<FindAllOrderResponse> => {
    const url = `/orders/all`;
    return axiosInstance.get(url);
  },
  //

  // [GET] /orders/all/:_id
  findById: (params: FindOrderByIdParams): Promise<FindOrderByIdResponse> => {
    const { _id } = params;
    console.log(_id);
    const url = `/orders/all/${_id}`;
    return axiosInstance.get(url);
  },

  // [PUT] /order/:_id
  update: (params: UpdateOrderParams, body: UpdateOrderBody): Promise<UpdateOrderResponse> => {
    const { _id } = params;
    const url = `/orders/${_id}`;
    return axiosInstance.put(url, body);
  },
};
export default orderApi;
