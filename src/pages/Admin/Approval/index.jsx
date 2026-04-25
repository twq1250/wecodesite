import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Tabs,
  Popconfirm,
  Empty,
  Spin,
  Modal,
  Input,
  message,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  fetchApprovalList,
  fetchMyApprovals,
  approveApplication,
  rejectApplication,
} from './thunk';
import { STATUS_MAP, APPROVAL_TYPE_MAP, APPROVAL_TABS, getApprovalColumns, getMyApprovalColumns } from './constants';
import './ApprovalCenter.m.less';

const { TextArea } = Input;

function ApprovalCenter() {
  const [loading, setLoading] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [myApprovals, setMyApprovals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    let result;
    
    if (activeTab === 'pending') {
      result = await fetchApprovalList({ status: 0 });
      if (result.code === '200') {
        setApprovalList(result.data);
      }
    } else if (activeTab === 'mine') {
      result = await fetchMyApprovals();
      if (result.code === '200') {
        setMyApprovals(result.data);
      }
    } else if (activeTab === 'all') {
      result = await fetchApprovalList({});
      if (result.code === '200') {
        setApprovalList(result.data);
      }
    }
    
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const res = await approveApplication(id);
    if (res && res.code === '200') {
      message.success('审批通过');
      loadData();
    } else {
      message.error(res?.message || '审批失败');
    }
  };

  const handleReject = async (id) => {
    const res = await rejectApplication(id);
    if (res && res.code === '200') {
      message.success('审批已拒绝');
      loadData();
    } else {
      message.error(res?.message || '审批失败');
    }
  };

  const handleViewDetail = (record) => {
    setCurrentDetail(record);
    setDetailVisible(true);
  };

  const renderApprovalType = (type) => {
    const typeMap = {
      'resource_register': '资源注册',
      'permission_apply': '权限申请',
    };
    return typeMap[type] || type;
  };

  const renderStatus = (status) => {
    const { text, color } = STATUS_MAP[status] || STATUS_MAP[0];
    return <Tag color={color}>{text}</Tag>;
  };

  const renderAction = (_, record) => (
    <Space>
      <Button
        type="link"
        size="small"
        icon={<EyeOutlined />}
        onClick={() => handleViewDetail(record)}
      >
        详情
      </Button>
      {record.status === 0 && activeTab === 'pending' && (
        <>
          <Popconfirm
            title="确定通过该申请吗？"
            onConfirm={() => handleApprove(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" icon={<CheckOutlined />}>
              通过
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定拒绝该申请吗？"
            onConfirm={() => handleReject(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<CloseOutlined />}>
              拒绝
            </Button>
          </Popconfirm>
        </>
      )}
    </Space>
  );

  const renderMyAction = (_, record) => (
    <Button
      type="link"
      size="small"
      icon={<EyeOutlined />}
      onClick={() => handleViewDetail(record)}
    >
      详情
    </Button>
  );

  const columns = getApprovalColumns({
    renderApprovalType,
    renderStatus,
    renderAction,
  });

  const myColumns = getMyApprovalColumns({
    renderApprovalType,
    renderStatus,
    renderAction: renderMyAction,
  });

  const dataSource = activeTab === 'mine' ? myApprovals : approvalList;
  const cols = activeTab === 'mine' ? myColumns : columns;

  return (
    <div className="approval-center">
      <div className="page-header">
        <div className="page-header-left">
          <h4 className="page-title">审批中心</h4>
          <span className="page-desc">审批权限申请，处理待办事项</span>
        </div>
      </div>

      <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'pending', label: '我的待审' },
            { key: 'mine', label: '我发起的' },
            { key: 'all', label: '全部' },
          ]}
        />

        <Spin spinning={loading}>
          {dataSource.length > 0 ? (
            <Table
              columns={cols}
              dataSource={dataSource}
              rowKey="id"
              pagination={{ pageSize: 20 }}
            />
          ) : (
            <Empty description="暂无数据" />
          )}
        </Spin>

      <Modal
        title="申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          <Button onClick={() => setDetailVisible(false)}>关闭</Button>
        }
      >
        {currentDetail && (
          <div>
            <p><strong>申请编号：</strong>{currentDetail.id}</p>
            <p><strong>申请人：</strong>{currentDetail.applicantName}</p>
            <p><strong>业务类型：</strong>{currentDetail.businessType}</p>
            <p><strong>业务名称：</strong>{currentDetail.businessName}</p>
            <p><strong>审批类型：</strong>{APPROVAL_TYPE_MAP[currentDetail.type] || currentDetail.type}</p>
            <p><strong>状态：</strong>{STATUS_MAP[currentDetail.status]?.text || '未知'}</p>
            <p><strong>申请时间：</strong>{currentDetail.createTime}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApprovalCenter;
