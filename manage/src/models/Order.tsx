export interface ShippingAddress {
  _id: string;
  country: string;
  name: string;
  phone_number: string;
  company: string;
  region: string;
  district: string;
  ward: string;
  street: string;
  delivery_address_type: string;
}
export interface PaymentMethod {
  method_text: string;
  method_key: string;
  message: string;
  description: string;
}
export interface Items {
  _id: string;
  name: string;
  images: [];
  original_price: string;
  price: string;
  limit: string;
  quantity: string;
  inventory_status: string;
  slug: string;
}
export interface PriceSummary {
  name: string;
  value: string;
}
export interface TrackingInfor {
  status: string;
  status_text: string;
  time: string;
}
export interface Order {
  _id: string;
  customer_id: string;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  items: Items[];
  price_summary: PriceSummary[];
  tracking_infor: TrackingInfor;
  note: string;
  // [key: string]: any;
}
