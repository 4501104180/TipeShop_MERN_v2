import { StatusResponse } from '../models';
import axiosInstance from './axiosInstance';

interface GraphProps {
  _id: string;
  tracking_infor: {
    status: string;
    status_text: string;
    time: string;
  };
  price_summary: { name: string; value: number }[];
  updatedAt: string;
}
interface HistoryProps {
  status: string;
  status_text: string;
  time: string;
}
interface Products {
  _id: string;
  name: string;
  images: [];
  quantity: number;
  quantity_sold: { text: string; value: number };
  slug: string;
  score: number;
}
export interface DashboardAllResponse extends StatusResponse {
  statistic: {
    totalSale: number;
    totalOrder: number;
    totalUser: number;
    totalProduct: number;
  };
  graph: GraphProps[];
  products: Products[];
  history: HistoryProps[];
  [key: string]: any;
}

const dashboardApi = {
  //[GET] /api/dashboard (All api dashboard)
  dashboardALL: (): Promise<DashboardAllResponse> => {
    const url = `/dashboard`;
    return axiosInstance.get(url);
  },
};
export default dashboardApi;
