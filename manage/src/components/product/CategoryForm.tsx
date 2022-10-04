import { useEffect } from 'react';
import styled from 'styled-components';
import { Space, Input, Spin, Button, Divider, Switch, Typography, message, Carousel } from 'antd';
import {
  ApartmentOutlined,
  CloseCircleFilled,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

// components
import { UploadSingleFile, UploadMultipleFile } from '../_external_/dropzone';
import CategorySelect from './CategorySelect';
// models
import type { Category, UploadFileType } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearAction, selectProduct } from '../../redux/slices/product';
import { CreateCategoryPayload, updateCategoryAction } from '../../redux/actions/product';
import { createCategoryAction } from '../../redux/actions/product';
// utils
import { capitalize } from '../../utils/formatString';
import { useFormik, FormikProvider, Form } from 'formik';
import { humanFileSize } from '../../utils/formatNumber';
import { createCategoryValidation } from '../../utils/validation';
import { distinguishImage } from '../../utils/formatImage';
import useDrawer from '../../hooks/useDrawer';

const { Text } = Typography;

interface CategoryFormProps {
  category?: Category;
}
const CategoryForm = ({ category }: CategoryFormProps) => {
  const { closeDrawer } = useDrawer();
  const { isLoading, lastAction, categories } = useAppSelector(selectProduct);
  const sliceDispatch = useAppDispatch();
  const initialValues: CreateCategoryPayload = {
    name: capitalize(category?.name) || '',
    image: category?.image || null,
    banners: category?.banners || [],
    parent_id: category?.parent_id || null,
    status: category?.status || '',
  };
  const formik = useFormik({
    initialValues,
    validationSchema: createCategoryValidation,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!category) {
        // create goes here
        message.loading({ content: 'Processing...', key: 'create' });
        sliceDispatch(createCategoryAction(values));
        return;
      }
      // update goes here
      message.loading({ content: 'Processing...', key: 'update' });
      sliceDispatch(
        updateCategoryAction({
          _id: category._id,
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
          closeDrawer();
          break;
        default:
          break;
      }
      sliceDispatch(clearAction());
    }
    // eslint-disable-next-line
  }, [lastAction]);
  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFieldValue('image', {
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };
  const handleMultipleDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles.map((file) =>
      Object.assign(file, {
        file,
        preview: URL.createObjectURL(file),
      })
    );
    setFieldValue('banners', files);
  };
  const handleRemove = (file: UploadFileType) => {
    const filteredFiles = values.banners.filter((_file) => _file !== file);
    setFieldValue('banners', filteredFiles);
  };
  const handleSelectCategory = (parent_id: string | null | undefined) => {
    setFieldValue('parent_id', parent_id);
  };
  const handleStatus = (checked: boolean) => {
    checked ? setFieldValue('status', 'locked') : setFieldValue('status', 'active');
  };
  return (
    <Spin spinning={isLoading}>
      <FormikProvider value={formik}>
        <Form>
          <Space direction="vertical" size="middle">
            <Space className="ant-space-children-full-width" size="large">
              <Space direction="vertical" size="middle">
                <Input
                  prefix={<ApartmentOutlined />}
                  size="middle"
                  placeholder="Category name..."
                  {...getFieldProps('name')}
                  status={Boolean(touched.name && errors.name) ? 'error' : ''}
                />
                {touched.name && (
                  <Text strong type="danger">
                    {errors.name}
                  </Text>
                )}
                <CategorySelect
                  categories={categories}
                  value={values.parent_id}
                  onChange={handleSelectCategory}
                />
                <Space>
                  <Switch
                    onChange={handleStatus}
                    checkedChildren={<UnlockOutlined />}
                    unCheckedChildren={<LockOutlined />}
                    checked={values.status !== 'active' && values.status !== ''}
                  />
                  <Text style={{ marginLeft: '15px' }}>Locked category</Text>
                </Space>
              </Space>
              <UploadSingleFile
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                }}
                maxSize={1048576}
                file={values.image}
                onDrop={handleDrop}
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
                style={{
                  width: '200px',
                  height: '200px',
                  margin: 'auto',
                }}
              />
            </Space>
            <UploadMultipleFile
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
              }}
              maxSize={1048576}
              files={values.banners}
              onDrop={handleMultipleDrop}
              onRemove={handleRemove}
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
              previewRender={(uploadedFiles) => (
                <Space direction="vertical" split={<Divider />}>
                  <CarouselWrapper autoplay effect="fade">
                    {uploadedFiles.map((file, index) => {
                      return (
                        file && (
                          <div style={{ position: 'relative' }} key={index}>
                            <CloseCircleFilled
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                fontSize: '30px',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRemove(file)}
                            />
                            <img
                              alt=""
                              src={typeof file === 'string' ? distinguishImage(file) : file.preview}
                              style={{ height: '300px', width: '100%' }}
                            />
                          </div>
                        )
                      );
                    })}
                  </CarouselWrapper>
                </Space>
              )}
              showRejected
            />
            <Button htmlType="submit" type="primary" block loading={isSubmitting}>
              {category ? 'Save changes' : 'Create'}
            </Button>
          </Space>
        </Form>
      </FormikProvider>
    </Spin>
  );
};

export default CategoryForm;

const CarouselWrapper = styled(Carousel)`
  > .slick-dots li {
    border-radius: 20px;
    height: 10px important;
    width: 30px !important;
    background: #1890ff !important;
  }
  > .slick-dots li.slick-active button {
    border-radius: 20px;
    background: #1890ff !important;
  }
`;
