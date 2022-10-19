import { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  message,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import { appConfig } from '../../config';
import useDrawer from '../../hooks/useDrawer';
import { Order } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearAction, selectOrders } from '../../redux/slices/order';
import { distinguishImage } from '../../utils/formatImage';
import { CreateOrderPayload, updateOrderAction } from '../../redux/actions/order';
import { toVND } from '../../utils/formatMoney';

const { Option } = Select;
const { Text } = Typography;
export interface OrderFormProps {
  order?: Order;
}

function OrderForm({ order }: OrderFormProps) {
  const index: number = 0;
  const sliceDispatch = useAppDispatch();
  const { isLoading, error, lastAction } = useAppSelector(selectOrders);
  const { closeDrawer } = useDrawer();
  const [form] = Form.useForm();
  useEffect(() => {
    if (lastAction !== undefined) {
      switch (lastAction) {
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

  const onFinish = (values: CreateOrderPayload) => {
    if (order) {
      // update goes here
      message.loading({ content: 'Processing...', key: 'update' });
      sliceDispatch(
        updateOrderAction({
          _id: order._id,
          ...values,
        })
      );
    }
  };
  const onStatusChange = (value: string) => {
    switch (value) {
      case 'processing':
        form.setFieldsValue('new_status');
        return;
      case 'transporting':
        form.setFieldsValue('new_status');
        return;
      case 'delivered':
        form.setFieldsValue('new_status');
        return;
      case 'canceled':
        form.setFieldsValue('new_status');
    }
  };
  return (
    <Spin spinning={isLoading}>
      <Space direction="vertical">
        <Text strong>Customer ID: {order?.customer_id}</Text>
      </Space>
      <Space direction="vertical">
        <Row style={{ marginTop: 10 }}>
          <Col span={12}>
            <Text strong>Shipping Address:</Text>
            <Card style={{ width: 330, height: 150 }}>
              <Text strong>{order?.shipping_address.name}</Text>
              <p>Phone number: {order?.shipping_address.phone_number}</p>
              <p>
                Address: {order?.shipping_address.street}, {order?.shipping_address.ward},{' '}
                {order?.shipping_address.district}, {order?.shipping_address.region}
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Text strong>Payment Method:</Text>
            <Card style={{ width: 330, height: 150 }}>
              <p>{order?.payment_method.method_text}</p>
            </Card>
          </Col>
        </Row>
      </Space>
      <Space>
        <Row>
          <Col span={24}>
            <Text strong>NOTE:</Text>
            <Card style={{ width: 670 }}>{order?.note}</Card>
          </Col>
        </Row>
      </Space>
      <Space direction="vertical">
        <Divider plain></Divider>
        <Row>
          <Col span={4} style={{ marginBottom: 10 }}>
            {order?.items.map((item) => (
              <Image
                width={100}
                height={100}
                src={distinguishImage(item.images[index])}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = `${appConfig.public_image_url}/avatar.png`;
                }}
                style={{ width: '100%', height: '100%' }}
              />
            ))}
          </Col>
          <Col span={14}>
            {order?.items.map((item) => (
              <>
                <Text strong>{item.name}</Text>
                <p>Original price: {item.original_price}</p>
                <p>Quantity: {item.quantity}</p>
              </>
            ))}
          </Col>
          <Col span={6}>
            {order?.items.map((item) => (
              <p style={{ height: 100, marginBottom: 0, textAlign: 'right' }}>
                {toVND(Number(item.price))}
              </p>
            ))}
          </Col>
        </Row>
        <Divider plain style={{ height: 0 }}></Divider>
        <Text strong>
          {order?.price_summary.map((price) => (
            <p style={{ textAlign: 'right', fontSize: 20 }}>
              {' '}
              Tatol Price: {toVND(Number(price.value))}
            </p>
          ))}
        </Text>
        <Form
          form={form}
          initialValues={{
            tracking_info_status: order?.tracking_infor.status || '',
          }}
          onFinish={onFinish}
        >
          <Space direction="vertical">
            <Form.Item name="new_status" label="Status">
              <Select
                defaultValue={order?.tracking_infor.status}
                onChange={onStatusChange}
                allowClear
              >
                <Option value="processing">Processing</Option>
                <Option value="transporting">Transporting</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="canceled">Cancel</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Save
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Space>
    </Spin>
  );
}
export default OrderForm;
