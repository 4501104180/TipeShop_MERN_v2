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

const { Text } = Typography;

const columns: ColumnsType<Product> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Text strong>{capitalize(text)}</Text>,
  },
  {
    title: 'Image',
    dataIndex: 'images',
    render: (_, record) => {
      const firstIndex: number = 0;
      const { images } = record;
      return (
        <Image
          width={150}
          src={distinguishImage(images[firstIndex])}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = `${appConfig.public_image_url}/avatar.png`;
          }}
          style={{ width: '100%', height: '100%' }}
        />
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
      return <Text strong>{discount}</Text>;
    },
  },
  {
    title: 'Discount Rate (%)',
    dataIndex: 'discount_rate',
    render: (_, record) => {
      const { discount_rate } = record;
      return <Text strong>{discount_rate}</Text>;
    },
  },
  {
    title: 'Orginal Price',
    dataIndex: 'original_price',
    render: (_, record) => {
      const { original_price } = record;
      return <Text strong>{original_price}</Text>;
    },
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (_, record) => {
      const { price } = record;
      return <Text strong>{price}</Text>;
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
  const { isLoading, products } = useAppSelector(selectProduct);
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
