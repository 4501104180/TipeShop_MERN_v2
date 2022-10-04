import { CSSProperties } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table, Space, Image, Typography, Button, Tag } from 'antd';
import {
  ApartmentOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

// config
import { appConfig } from '../../config';
// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import { Category } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectProduct } from '../../redux/slices/product';
// utils
import { distinguishImage } from '../../utils/formatImage';
import { capitalize } from '../../utils/formatString';
import { deleteCategoryAction } from '../../redux/actions/product';

const { Text } = Typography;

const columns: ColumnsType<Category> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Text strong>{capitalize(text)}</Text>,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    render: (text) => (
      <Image
        width={150}
        src={distinguishImage(text)}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = `${appConfig.public_image_url}/avatar.png`;
        }}
        style={{ width: '100%', height: '100%' }}
      />
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (_, record) => {
      const { status } = record;
      const statusTag = {
        color: status === 'active' ? 'success' : 'error',
        text:
          status === 'active' ? (
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
        value: 'active',
      },
      {
        text: 'Locked',
        value: 'locked',
      },
    ],
    onFilter: (value, record) => record.status === value,
  },
];
const Categories = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const { isLoading, categories } = useAppSelector(selectProduct);
  const dispatch = useAppDispatch();
  const { openDrawer } = useDrawer();
  const expandStyle: CSSProperties = {
    position: 'relative',
    left: '-5px',
    transition: '0.5s',
  };
  const actionsAccessible: ColumnsType<Category> = [
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
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  openDrawer({
                    key: 'categoryForm',
                    title: `Update [${capitalize(name)}] category`,
                    props: { category: record },
                    size: 'large',
                  })
                }
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
                    content: 'After deletion, the category will be saved to the recycle bin',
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Delete',
                    onOk() {
                      dispatch(deleteCategoryAction({ _id }));
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
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        {actionsAllowed.includes('create') && (
          <Button
            type="primary"
            shape="round"
            icon={<ApartmentOutlined />}
            onClick={() =>
              openDrawer({
                key: 'categoryForm',
                title: 'Create category',
                size: 'large',
              })
            }
          >
            Create category
          </Button>
        )}
        {actionsAllowed.includes('delete') && (
          <Button type="dashed" shape="round" icon={<DeleteOutlined />} danger>
            Recycle bin
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        expandable={{
          defaultExpandAllRows: true,
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children?.length > 0 ? (
              expanded ? (
                <CaretRightOutlined
                  style={{
                    ...expandStyle,
                    transform: 'rotate(90deg)',
                  }}
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  style={{ ...expandStyle }}
                  onClick={(e) => onExpand(record, e)}
                />
              )
            ) : null,
        }}
        loading={isLoading}
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={categories}
      />
    </Space>
  );
};

export default Categories;
