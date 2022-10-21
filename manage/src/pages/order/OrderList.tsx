import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Typography, Space, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import { Order } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectOrders } from '../../redux/slices/order';
//utils
import { capitalize, toLocaleTime } from '../../utils/formatString';
import { toVND } from '../../utils/formatMoney';

const { Text } = Typography;

const columns: ColumnsType<Order> = [
  {
    title: '#ID Order',
    dataIndex: '_id',
    render: (text) => <Text>#{capitalize(text)}</Text>,
  },
  {
    title: 'Date',
    dataIndex: 'tracking_infor',
    render: (_, record) => {
      const { tracking_infor } = record;
      const time = tracking_infor.time;
      return <Text>{toLocaleTime(time)}</Text>;
    },
  },
  {
    title: 'Total Price',
    dataIndex: 'price_summary',
    render: (_, record) => {
      const { price_summary } = record;
      const _price_summary = price_summary[0];
      return <Text>{toVND(Number(_price_summary.value))}</Text>;
    },
  },
  {
    title: 'Buyer',
    dataIndex: 'shipping_address',
    render: (_, record) => {
      const { shipping_address } = record;
      const buyer = shipping_address.name;
      return <Text>{capitalize(buyer)}</Text>;
    },
  },
  {
    title: 'Status',
    dataIndex: 'tracking_infor',
    render: (_, record) => {
      const { tracking_infor } = record;
      const status = tracking_infor.status;
      const statusTag = {
        color:
          status === 'processing'
            ? 'blue'
            : status === 'awaiting_payment'
            ? 'magenta'
            : status === 'transporting'
            ? 'yellow'
            : status === 'delivered'
            ? 'success'
            : 'error',
        text:
          status === 'processing' ? (
            <Text strong style={{ color: '#002766' }}>
              Processing
            </Text>
          ) : status === 'awaiting_payment' ? (
            <Text strong type="danger">
              Awaiting Payment
            </Text>
          ) : status === 'transporting' ? (
            <Text strong type="warning">
              Transporting
            </Text>
          ) : status === 'delivered' ? (
            <Text strong type="success">
              Delivered
            </Text>
          ) : (
            <Text strong type="danger">
              Cancel
            </Text>
          ),
      };
      return <Tag color={statusTag.color}>{statusTag.text}</Tag>;
    },
    filters: [
      {
        text: 'Processing',
        value: 'processing',
      },
      {
        text: 'Awaiting Payment',
        value: 'awaiting_payment',
      },
      {
        text: 'Transporting',
        value: 'transporting',
      },
      {
        text: 'Delivered',
        value: 'delivered',
      },
      {
        text: 'Canceled',
        value: 'canceled',
      },
    ],
    onFilter: (value, record) => record.tracking_infor.status.indexOf(value as string) >= 0,
  },
];
const OrderList = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const navigate = useNavigate();
  const { openDrawer } = useDrawer();
  const { isLoading, orders } = useAppSelector(selectOrders);

  const actionsAccessible: ColumnsType<Order> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { _id } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('change') && (
              <Tag
                icon={<EditOutlined />}
                color="success"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  openDrawer({
                    key: 'orderForm',
                    title: `Update order: [#${capitalize(_id)}]`,
                    props: { order: record },
                    size: 'large',
                  })
                }
              >
                Change
              </Tag>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Table
        tableLayout="auto"
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        loading={isLoading}
        dataSource={orders}
      />
      ;
    </Space>
  );
};

export default OrderList;
