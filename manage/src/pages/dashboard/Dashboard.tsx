import { useState, useEffect } from 'react';

import { Card, Col, Row, Typography, Progress, Button, Timeline, Skeleton } from 'antd';
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
  const timelineList = [
    {
      title: '$2,400 - Redesign store',
      time: '09 JUN 7:20 PM',
      color: 'green',
    },
    {
      title: 'New order #3654323',
      time: '08 JUN 12:20 PM',
      color: 'green',
    },
    {
      title: 'Company server payments',
      time: '04 JUN 3:10 PM',
    },
    {
      title: 'New card added for order #4826321',
      time: '02 JUN 2:45 PM',
    },
    {
      title: 'Unlock folders for development',
      time: '18 MAY 1:30 PM',
    },
    {
      title: 'New order #46282344',
      time: '14 MAY 3:30 PM',
      color: 'gray',
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
            <div className="timeline-box">
              <Title level={5}>Orders History</Title>
              <Paragraph className="lastweek" style={{ marginBottom: 24 }}></Paragraph>
              <Timeline pending="Recording..." className="timelinelist" reverse={reverse}>
                {/* {timelineList.map((t, index) => (
                  <Timeline.Item color={t.color} key={index}>
                    <Title level={5}>{t.title}</Title>
                    <Text>{t.time}</Text>
                  </Timeline.Item>
                ))} */}
                {dashboard?.history.map((history, index) => (
                  <Timeline.Item color={'gray'} key={index}>
                    <Title level={5}>{history.status_text}</Title>
                    <Text>{history.time}</Text>
                  </Timeline.Item>
                ))}
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
