import { ReactNode } from 'react';
import { Space, Typography } from 'antd';

// components
import Back from '../../components/Back';
import type { ProductFormProps } from '../../components/product/ProductForm';
import { ProductForm } from '../../components/product';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectProduct } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/path';

const { Title, Text } = Typography;

export type Key = 'general';

export interface ScrollKeyProps {
  key: Key;
  label: ReactNode;
}

const scrollKeys: ScrollKeyProps[] = [
  {
    key: 'general',
    label: <Text>Product Information</Text>,
  },
];

const keys = scrollKeys.reduce((accumulator, current) => {
  const { key, label } = current;
  return {
    ...accumulator,
    [key]: {
      key,
      label,
    },
  };
}, {} as Record<Key, ScrollKeyProps>);

const ProductCreate = () => {
  const { products } = useAppSelector(selectProduct);
  const isEdit = window.location.pathname.indexOf('/edit') >= 0;
  const _id = window.location.pathname.split('/').pop();
  const propsProduct: ProductFormProps & { backTo: string } = {
    product: isEdit ? products.find((product) => product._id === _id) : undefined,
    backTo: PATH_DASHBOARD.products.productList,
  };
  return (
    <div>
      <Back backTo={propsProduct.backTo} scrollKeys={scrollKeys} />
      <Space direction="vertical" size="small" id={keys.general.key}>
        <Title level={5}>{keys.general.label}</Title>
        <ProductForm product={propsProduct.product} />
      </Space>
    </div>
  );
};

export default ProductCreate;
