import { useState, Key } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Table, Space, Image, Typography, Tag, Button, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  UnlockOutlined,
  LockOutlined,
} from '@ant-design/icons';

// config
import { appConfig } from '../../config';
// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// models
import { Product } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectProduct } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/path';
// utils
import { distinguishImage } from '../../utils/formatImage';
import { capitalize } from '../../utils/formatString';
import { deleteProductAction } from '../../redux/actions/product';
import { toVND } from '../../utils/formatMoney';

const { Text } = Typography;

const columns: ColumnsType<Product> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    render: (text) => <Text style={{ wordBreak:"break-all"}}>{capitalize(text)}</Text>,
  },
  {
    title: 'Image',
    dataIndex: 'images',
    render: (_, record) => {
      const firstIndex: number = 0;
      const { images } = record;
      return (
        <>
          {images.length === 0 && (
            <Image
              width={150}
              src="error"
              fallback="data:image/png;base64,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"
            />
          )}
          {images.length > 0 && (
            <Image
              width={150}
              src={distinguishImage(images[firstIndex])}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = `${appConfig.public_image_url}/avatar.png`;
              }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </>
      );
    },
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    render: (_, record) => {
      const { quantity } = record;
      return <Text strong>{quantity}</Text>;
    },
  },
  {
    title: 'Limit',
    dataIndex: 'limit',
    render: (_, record) => {
      const { limit } = record;
      return <Text strong>{limit}</Text>;
    },
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    render: (_, record) => {
      const { discount } = record;
      var _discount = Number(discount);
      return <Text strong>{toVND(_discount)}</Text>;
    },
  },
  {
    title: 'Discount Rate (%)',
    dataIndex: 'discount_rate',
    render: (_, record) => {
      const { discount_rate } = record;
      return <Text strong>{discount_rate}%</Text>;
    },
  },
  {
    title: 'Orginal Price',
    dataIndex: 'original_price',
    render: (_, record) => {
      const { original_price } = record;
      var _orginal_price = Number(original_price);
      return <Text strong>{toVND(_orginal_price)}</Text>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (_, record) => {
      const { price } = record;
      var _price = Number(price);
      return <Text strong>{toVND(_price)}</Text>;
    },
  },
  {
    title: 'Inventory Status',
    dataIndex: 'status',
    render: (_, record) => {
      const { inventory_status } = record;
      const statusTag = {
        color: inventory_status === 'availabel' ? 'success' : 'error',
        text:
          inventory_status === 'availabel' ? (
            <Text strong type="success">
              <UnlockOutlined /> Available
            </Text>
          ) : (
            <Text strong type="danger">
              <LockOutlined /> Locked
            </Text>
          ),
      };
      return <Tag color={statusTag.color}>{statusTag.text}</Tag>;
    },
    filters: [
      {
        text: 'Active',
        value: 'availabel',
      },
      {
        text: 'Locked',
        value: 'locked',
      },
    ],
    onFilter: (value, record) => record.inventory_status === value,
  },
];
const ProductList = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { isLoading, products, warranties, specifications } = useAppSelector(selectProduct);
  console.log(warranties);
  console.log(specifications);
  const actionsAccessible: ColumnsType<Product> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { _id, name } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('update') && (
              <Tag
                icon={<EditOutlined />}
                color="success"
                onClick={() => navigate(PATH_DASHBOARD.products.edit(record._id))}
                style={{ cursor: 'pointer' }}
              >
                Update
              </Tag>
            )}
            {actionsAllowed.includes('delete') && (
              <Tag
                icon={<DeleteOutlined />}
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  Modal.confirm({
                    centered: true,
                    title: `Are you sure you want to delete [${name}]?`,
                    content: 'After deletion, the product will be saved to the recycle bin',
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Delete',
                    onOk() {
                      dispatch(deleteProductAction({ _id }));
                    },
                  });
                }}
              >
                Delete
              </Tag>
            )}
          </Space>
        );
      },
    },
  ];
  const handleCreate = () => {
    navigate(PATH_DASHBOARD.products.create());
  };
  const handleChangeSelectedRow = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        {actionsAllowed.includes('create') && (
          <Button type="primary" shape="round" icon={<FolderAddOutlined />} onClick={handleCreate}>
            Create product
          </Button>
        )}
        <Button type="dashed" shape="round" icon={<DeleteOutlined />} danger>
          Recycle bin
        </Button>
        {selectedRowKeys.length > 0 && (
          <Button type="primary" shape="round" danger icon={<DeleteOutlined />}>
            Delete selected accounts
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        tableLayout="auto"
        loading={isLoading}
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={products}
      />
    </Space>
  );
};

export default ProductList;
