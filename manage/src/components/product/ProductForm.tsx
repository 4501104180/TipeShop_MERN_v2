import { useEffect } from 'react';
import styled from 'styled-components';
import { Button, Col, Input, message, Space, Switch, Typography, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useFormik, FormikProvider, Form } from 'formik';
// components
import Box from '../Box';
import CategorySelect from './CategorySelect';
// models
import { Category, Product, UploadFileType } from '../../models';
import { UploadMultipleFile } from '../_external_/dropzone';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CreateProductPayload, updateProductAction } from '../../redux/actions/product';
import { createProductsAction } from '../../redux/actions/product';
import { clearAction, selectProduct } from '../../redux/slices/product';
// utils
import { createProductValidation, updateProductValidation } from '../../utils/validation';
import { humanFileSize } from '../../utils/formatNumber';
import { capitalize } from '../../utils/formatString';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../routes/path';

const { Text } = Typography;

export interface ProductFormProps {
  product?: Product;
  category?: Category['_id'];
}

const ProductForm = ({ product, category }: ProductFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lastAction, categories } = useAppSelector(selectProduct);
  const initialValues: CreateProductPayload = {
    name: capitalize(product?.name) || '',
    images: product?.images || [],
    quantity: product?.quantity || '',
    category: product?.category || null,
    limit: product?.limit || null,
    description: product?.description || '',
    discount: product?.discount || '',
    discount_rate: product?.discount_rate || '',
    inventory_status: product?.inventory_status || '',
    original_price: product?.original_price || '',
    price: product?.price || '',
    shippable: product?.shippable || true,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: product ? updateProductValidation : createProductValidation,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!product) {
        // create goes here
        message.loading({ content: 'Processing...', key: 'create' });
        dispatch(createProductsAction(values));
        return;
      }
      // update goes here
      message.loading({ content: 'Processing...', key: 'update' });
      dispatch(
        updateProductAction({
          _id: product._id,
          ...values,
        })
      );
    },
  });
  const { values, touched, errors, isSubmitting, getFieldProps, setFieldValue, resetForm } = formik;
  useEffect(() => {
    if (lastAction !== undefined) {
      switch (lastAction) {
        case 'create':
          resetForm();
          break;
        case 'update':
          navigate(PATH_DASHBOARD.products.productList);
          break;
        default:
          break;
      }
      dispatch(clearAction());
    }
    // eslint-disable-next-line
  }, [lastAction]);
  const handleMultipleDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, {
        file,
        preview: URL.createObjectURL(file),
      })
    );
    setFieldValue('images', files);
  };
  const handleRemove = (file: UploadFileType) => {
    const filteredFiles = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredFiles);
  };
  const handleSelectCategory = (_id: string | null | undefined) => {
    setFieldValue('category', _id);
  };
  const handleInventoryStatus = (checked: boolean) => {
    checked
      ? setFieldValue('inventory_status', 'locked')
      : setFieldValue('inventory_status', 'availabel');
  };
  const handleShippable = (checked: boolean) => {
    checked ? setFieldValue('shippable', false) : setFieldValue('shippable', 'true');
  };
  return (
    <FormikProvider value={formik}>
      <Form>
        <Row gutter={25} align="middle" style={{ padding: '0 10px' }}>
          <Col flex="auto">
            <Box direction="vertical" size="middle" style={{ padding: '20px' }}>
              <Space direction="vertical" size="small">
                <Text strong>Name:</Text>
                <Input
                  size="large"
                  placeholder="Enter product name..."
                  {...getFieldProps('name')}
                  status={Boolean(touched.name && errors.name) ? 'error' : ''}
                />
                {touched.name && (
                  <Text strong type="danger">
                    {errors.name}
                  </Text>
                )}
              </Space>
              <Space direction="vertical" size="small">
                <Text strong>Category:</Text>
                <CategorySelect
                  categories={categories}
                  value={values.category}
                  onChange={handleSelectCategory}
                />
              </Space>
              <Stack>
                <Space direction="vertical" size="small">
                  <Text strong>Quantity:</Text>
                  <Input
                    size="large"
                    placeholder="Enter quantity..."
                    {...getFieldProps('quantity')}
                    status={Boolean(touched.quantity && errors.quantity) ? 'error' : ''}
                  />
                  {touched.quantity && (
                    <Text strong type="danger">
                      {errors.quantity}
                    </Text>
                  )}
                </Space>
                <Space direction="vertical" size="small">
                  <Text strong>Limit:</Text>
                  <Input
                    size="large"
                    placeholder="Enter limit..."
                    {...getFieldProps('limit')}
                    status={Boolean(touched.limit && errors.limit) ? 'error' : ''}
                  />
                  {touched.limit && (
                    <Text strong type="danger">
                      {errors.limit}
                    </Text>
                  )}
                </Space>
              </Stack>
              <Stack>
                <Space direction="vertical" size="small">
                  <Text strong>Discount:</Text>
                  <Input
                    size="large"
                    placeholder="Enter discount..."
                    {...getFieldProps('discount')}
                    status={Boolean(touched.discount && errors.discount) ? 'error' : ''}
                  />
                  {touched.discount && (
                    <Text strong type="danger">
                      {errors.discount}
                    </Text>
                  )}
                </Space>
                <Space direction="vertical" size="small">
                  <Text strong>Discount Rate:</Text>
                  <Input
                    size="large"
                    placeholder="Enter discount rate..."
                    {...getFieldProps('discount_rate')}
                    status={Boolean(touched.discount_rate && errors.discount_rate) ? 'error' : ''}
                  />
                  {touched.discount_rate && (
                    <Text strong type="danger">
                      {errors.discount_rate}
                    </Text>
                  )}
                </Space>
              </Stack>
              <Stack>
                <Space direction="vertical" size="small">
                  <Text strong>Original Price:</Text>
                  <Input
                    size="large"
                    placeholder="Enter original Price..."
                    {...getFieldProps('original_price')}
                    status={Boolean(touched.original_price && errors.original_price) ? 'error' : ''}
                  />
                  {touched.original_price && (
                    <Text strong type="danger">
                      {errors.original_price}
                    </Text>
                  )}
                </Space>
                <Space direction="vertical" size="small">
                  <Text strong>Price:</Text>
                  <Input
                    size="large"
                    placeholder="Enter price..."
                    {...getFieldProps('price')}
                    status={Boolean(touched.price && errors.price) ? 'error' : ''}
                  />
                  {touched.price && (
                    <Text strong type="danger">
                      {errors.price}
                    </Text>
                  )}
                </Space>
              </Stack>
              <Space direction="vertical" size="small">
                <Text strong>Description:</Text>
                <TextArea
                  size="large"
                  placeholder="Enter description..."
                  {...getFieldProps('description')}
                  status={Boolean(touched.description && errors.description) ? 'error' : ''}
                />
                {touched.description && (
                  <Text strong type="danger">
                    {errors.description}
                  </Text>
                )}
              </Space>
              <Stack>
                <Space>
                  <Switch
                    onClick={handleShippable}
                    checkedChildren={<UnlockOutlined />}
                    unCheckedChildren={<LockOutlined />}
                    checked={values.shippable === false}
                  />
                  <Text style={{ marginLeft: '15px' }}>Locked Shippable</Text>
                </Space>
                <Space>
                  <Switch
                    onChange={handleInventoryStatus}
                    checkedChildren={<UnlockOutlined />}
                    unCheckedChildren={<LockOutlined />}
                    checked={
                      values.inventory_status !== 'availabel' && values.inventory_status !== ''
                    }
                  />
                  <Text style={{ marginLeft: '15px' }}>Locked Inventory</Text>
                </Space>
              </Stack>
              <Button htmlType="submit" type="primary" block loading={isSubmitting}>
                {product ? 'Save changes' : 'Create'}
              </Button>
            </Box>
          </Col>
          <Col flex="380px">
            <Box direction="vertical" size="large" style={{ padding: '15px', height: '100%' }}>
              <Text strong>Images:</Text>
              <UploadMultipleFile
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                }}
                maxSize={1048576}
                files={values.images}
                onDrop={handleMultipleDrop}
                onRemove={handleRemove}
                style={{ padding: '5px', height: '80px' }}
                caption={
                  <Text
                    type="secondary"
                    className="caption"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {humanFileSize(1048576)}
                  </Text>
                }
                showRejected
              />
            </Box>
          </Col>
        </Row>
      </Form>
    </FormikProvider>
  );
};

export default ProductForm;
const Stack = styled(Space)({
  '& > .ant-space-item': {
    width: '100%',
  },
});
