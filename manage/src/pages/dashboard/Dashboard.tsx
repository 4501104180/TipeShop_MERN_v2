import { useState, useEffect } from 'react';

import { Card, Col, Row, Typography, Progress, Button, Timeline } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import {
  DollarTwoTone,
  IdcardTwoTone,
  HeartTwoTone,
  ShoppingTwoTone,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

// apis
import type { DashboardAllResponse } from '../../apis/dashboardApi';
import dashboardApi from '../../apis/dashboardApi';
// utils
import { toVND } from '../../utils/formatMoney';
import { distinguishImage } from '../../utils/formatImage';
// graph
import Echart from './chart/EChart';
import LineChart from './chart/LineChart';

import './style.css';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardAllResponse | null>(null);
  const [reverse, setReverse] = useState(false);
  useEffect(() => {
    const getDashboard = async () => {
      const dashboard = await dashboardApi.dashboardALL();
      setDashboard(dashboard);
      console.log(dashboard);
    };
    getDashboard();
  }, []);
  const count = [
    {
      today: 'Gross revenues',
      title: toVND(dashboard?.statistic.totalSale || 0),
      persent: '+30%',
      icon: <DollarTwoTone style={{ fontSize: '22px', color: '#08c' }} />,
      bnb: 'bnb2',
    },
    {
      today: 'Shopping basket',
      title: dashboard?.statistic.totalOrder || 0,
      persent: '10%',
      icon: <ShoppingTwoTone style={{ fontSize: '22px', color: '#08c' }} />,
      bnb: 'bnb2',
    },
    {
      today: 'Users',
      title: dashboard?.statistic.totalUser || 0,
      persent: '+20%',
      icon: <IdcardTwoTone style={{ fontSize: '22px', color: '#08c' }} />,
      bnb: 'bnb2',
    },
    {
      today: 'All of products',
      title: dashboard?.statistic.totalProduct || 0,
      persent: '-20%',
      icon: <HeartTwoTone style={{ fontSize: '22px', color: '#08c' }} />,
      bnb: 'redtext',
    },
  ];
  if (!dashboard) {
  }
  return (
    <div className="layout-content">
      {/* Total  */}
      <Row className="rowgap-vbox" gutter={[24, 0]}>
        {count.map((c, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
            <Card bordered={false} className="criclebox ">
              <div className="number">
                <Row align="middle" gutter={[24, 0]}>
                  <Col xs={18}>
                    <span>{c.today}</span>
                    <Title level={3}>
                      {c.title}
                      {/* <small className={c.bnb}>{c.persent}</small> */}
                    </Title>
                  </Col>
                  <Col xs={6}>
                    <div className="icon-box">{c.icon}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Graph */}
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Echart />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <LineChart />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 0]}>
        {/* Trending Products */}
        <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-24">
          <Card bordered={false} className="criclebox cardbody h-full">
            <div className="project-ant">
              <div>
                <Title level={5}>Trending Products</Title>
                <Paragraph className="lastweek"></Paragraph>
              </div>
            </div>
            <div className="ant-list-box table-responsive">
              <table className="width-100">
                <thead>
                  <tr>
                    <th>PRODUCST</th>
                    <th>REVENUE</th>
                    <th>COMPLETION</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard?.products.map((product, index) => {
                    const firstIndex: number = 0;
                    const { images, quantity, quantity_sold } = product;
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            <h6>
                              <img src={distinguishImage(images[firstIndex])} alt="" />
                              {product.name}
                            </h6>
                          </td>
                          <td>
                            <span className="text-xs font-weight-bold">
                              {product.quantity_sold.value}{' '}
                            </span>
                          </td>
                          <td>
                            <div className="percent-progress">
                              <Progress
                                percent={Math.round(
                                  (quantity_sold.value / (quantity + quantity_sold.value)) * 100
                                )}
                              />
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
        {/* History Order */}
        <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title style={{ position: 'absolute' }} level={5}>
              Orders History
            </Title>
            <div className="timeline-box">
              <Timeline className="timelinelist" reverse={!reverse}>
                {dashboard?.history.map((_history, index) => {
                  const { time, status, status_text } = _history;
                  const event = new Date(time);
                  var times = new Date(event.toJSON()).toLocaleString();
                  let color;
                  if (status === 'processing') color = 'gray';
                  else if (status === 'transporting') color = 'orange';
                  else if (status === 'delivered') color = 'green';
                  else color = 'red';
                  return (
                    <>
                      <Timeline.Item color={color} key={index}>
                        <Title level={5}>{status_text}</Title>
                        <Text>{times}</Text>
                      </Timeline.Item>
                    </>
                  );
                })}
              </Timeline>
              <Button type="primary" className="width-100" onClick={() => setReverse(!reverse)}>
                {<MenuUnfoldOutlined />} REVERSE
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dashboard;
