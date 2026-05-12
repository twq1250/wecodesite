import React from 'react';
import { Tag, Button, Space } from 'antd';
import { SUBSCRIPTION_STATUS, STATUS_MAP, AUTH_TYPE, CALLBACK_CHANNEL_TYPE, EVENT_CHANNEL_TYPE } from './constants';
import { openUrl } from './common';

export const NEED_REVIEW_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'true', label: '需要审核' },
  { value: 'false', label: '无需审核' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const renderSubscriptionStatus = (status) => {
  const { text, color } = SUBSCRIPTION_STATUS[status];
  return <Tag color={color}>{text}</Tag>;
};

export const renderNeedApprovalStatus = (needApproval, record) => {
  const val = needApproval !== undefined ? needApproval : record?.needReview;
  return val ?
    <Tag color="orange">需要审核</Tag> :
    <Tag color="green">无需审核</Tag>;
};



export const createDrawerColumns = ({ nameLabel = '名称', identifierField = 'scope', identifierPlaceholder = '' }) => {
  return [
    {
      title: nameLabel,
      dataIndex: 'nameCn',
      key: 'nameCn',
      width: 200,
      render: (text, record) => {
        const name = record.nameCn || record.name || '-';
        const identifier = record[identifierField] || '';
        return (
          <div>
            <div>{name}</div>
            {identifier && (
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>{identifier}</span>
            )}
          </div>
        );
      },
    },
    {
      title: '是否需要审核',
      dataIndex: 'needApproval',
      key: 'needApproval',
      width: 120,
      render: renderNeedApprovalStatus,
    },
    {
      title: '订阅状态',
      dataIndex: 'isSubscribed',
      key: 'isSubscribed',
      width: 100,
      render: renderSubscriptionStatus,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => {
        const docUrl = record.docUrl || record.resource?.docUrl;
        return (
          <Button type="link" size="small" onClick={() => openUrl(docUrl)}>
            查看文档
          </Button>
        );
      },
    },
  ];
};

export const createCallbackDrawerColumns = () => createDrawerColumns({
  nameLabel: '回调名称',
  identifierField: 'scope',
});

export const createEventDrawerColumns = () => createDrawerColumns({
  nameLabel: '事件名称',
  identifierField: 'topic',
});

export const createApiDrawerColumns = () => createDrawerColumns({
  nameLabel: '权限名称',
  identifierField: 'scope',
});

export const createResourceActionColumn = ({ 
  showEdit = false, 
  showWithdraw = true,
  showDelete = true 
}) => {
  return {
    title: '操作',
    key: 'action',
    width: showEdit ? 300 : (showWithdraw ? 240 : 100),
    fixed: 'right',
    render: (_, record, { handleCopyApprovalAddress, handleWithdraw, handleDeleteClick, handleEdit }) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="link" size="small" onClick={() => openUrl(record.docUrl || record.resource?.docUrl)}>查看文档</Button>
        {showEdit && record.status === 1 && (
          <Button type="link" size="small" onClick={() => handleEdit?.(record)}>编辑</Button>
        )}
        {showWithdraw && record.status === 0 && (
          <>
            <Button type="link" size="small" onClick={() => handleCopyApprovalAddress?.(record)}>复制审批地址</Button>
            <Button type="link" size="small" onClick={() => handleWithdraw?.(record)}>撤回审核</Button>
          </>
        )}
        {showDelete && record.status !== 0 && (
          <Button type="link" size="small" danger onClick={() => handleDeleteClick?.(record.id)}>删除</Button>
        )}
      </div>
    ),
  };
};

export const createApiManagementColumns = () => [
  {
    title: '权限名称',
    dataIndex: ['permission', 'nameCn'],
    key: 'nameCn',
    width: 180,
  },
  {
    title: 'scope',
    dataIndex: ['permission', 'scope'],
    key: 'scope',
    width: 180,
    ellipsis: true,
    render: (code) => <code>{code}</code>,
  },
  {
    title: '认证方式',
    dataIndex: 'authType',
    key: 'authType',
    width: 100,
    render: (type) => AUTH_TYPE[type] || '-',
  },
  {
    title: '分类',
    dataIndex: ['category', 'nameCn'],
    key: 'category',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: renderSubscriptionStatus,
  },
  createResourceActionColumn({ showEdit: false }),
];

export const createCallbackColumns = () => [
  {
    title: '回调名称',
    dataIndex: ['permission', 'nameCn'],
    key: 'nameCn',
    width: 200,
    render: (text, record) => (
      <div>
        <div>{text}</div>
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>{record.permission?.scope}</span>
      </div>
    ),
  },
  {
    title: '所需权限',
    dataIndex: ['permission', 'nameCn'],
    key: 'permissionName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '通道类型',
    dataIndex: 'channelType',
    key: 'channelType',
    width: 100,
    render: (type) => CALLBACK_CHANNEL_TYPE[type] || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: renderSubscriptionStatus,
  },
  createResourceActionColumn({ showEdit: true }),
];

export const createEventColumns = () => [
  {
    title: '事件名称',
    dataIndex: ['permission', 'nameCn'],
    key: 'nameCn',
    width: 200,
    render: (text, record) => (
      <div>
        <div>{text}</div>
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>{record.event?.topic}</span>
      </div>
    ),
  },
  {
    title: '所需权限',
    dataIndex: ['permission', 'nameCn'],
    key: 'permissionName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '订阅方式',
    dataIndex: 'channelType',
    key: 'channelType',
    width: 100,
    render: (type) => EVENT_CHANNEL_TYPE[type] || '-',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: renderSubscriptionStatus,
  },
  createResourceActionColumn({ showEdit: true }),
];

export const adminTableBaseColumn = ({ handleView, handleEdit, handleDelete }) => [
  {
    title: 'Scope',
    dataIndex: 'permission',
    key: 'scope',
    width: 200,
    ellipsis: true,
    render: (permission) => {
      const scope = permission?.scope || '-';
      return <Tag color='cyan'>{scope}</Tag>
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      const { text, color } = STATUS_MAP[status] || STATUS_MAP[0];
      return <Tag color={color}>{text}</Tag>
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
    render: (_, record) => {
      return (
        <Space>
          <Button type='link' size='small' onClick={() => handleView(record)}>详情</Button>
          {record.status !== 0 && <Button type='link' size='small' onClick={() => handleEdit(record)}>编辑</Button>}
          <Button type='link' size='small' danger onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      );
    }
  },
]
