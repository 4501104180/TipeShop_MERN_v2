export interface Category {
  _id: string;
  name: string;
  image: string | null;
  banners: [];
  parent_id: string | null;
  status: string;
  children: Category[];
  slug: string;
}
export interface AttributeValue {
  _id: string;
  attribute_query_name: string;
  display_value: string;
  query_value: string;
}

export interface Warranty {
  _id: string;
  name: string;
  value: string;
}
export interface Specification {
  _id: string;
  name: string;
  value: string;
}
export interface Product {
  _id: string;
  name: string;
  images: [];
  quantity: string | null;
  category: Category['_id'] | null;
  // attribute_values: AttributeValue[];
  warranty_infor: Warranty | null;
  specifications: Specification | null;
  limit: number | null;
  discount: string | null;
  discount_rate: string | null;
  original_price: string | null;
  price: string | null;
  description: string | null;
  inventory_status: string;
  shippable: boolean;
  slug: string;
}
