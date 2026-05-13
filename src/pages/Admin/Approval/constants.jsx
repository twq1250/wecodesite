/**
 * Admin模块 - 审批管理页面常量配置
 * 定义审批级别映射、表格列配置
 */
import React from 'react';
import { Tag, Button, Space, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SUBSCRIPTION_STATUS } from '../../../utils/constants';

/**
 * 审批级别映射配置
 */
export const LEVEL_MAP = {
  'resource': { text: '资源审批', color: 'blue' },
  'scene': { text: '场景审批', color: 'orange' },
  'global': { text: '全局审批', color: 'green' },
};

/**
 * 业务信息表格列配置（待审批列表、我发起的、全部共用）
 */
export const BUSINESS_COLUMNS = [
  {
    title: '业务类型',
    dataIndex: 'businessType',
    key: 'businessType',
    width: 120,
  },
  {
    title: '业务名称',
    dataIndex: 'businessName',
    key: 'businessName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '业务ID',
    dataIndex: 'businessId',
    key: 'businessId',
    width: 150,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => {
      const { text, color } = SUBSCRIPTION_STATUS[status] || SUBSCRIPTION_STATUS[0];
      return <Tag color={color}>{text}</Tag>;
    },
  },
];

/**
 * 生成待审批列表表格列配置（我的待审）
 * @param {Object} callbacks - 回调函数对象，包含 handleViewDetail（查看详情）、handleApprove（通过）、handleReject（拒绝）
 * @returns {Array} 表格列配置数组
 */
export const getApprovalColumns = ({ handleViewDetail, handleApprove, handleReject }) => [
  {
    title: '申请编号',
    dataIndex: 'id',
    key: 'id',
    width: 180,
    ellipsis: true,
  },
  {
    title: '申请人',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 100,
  },
  ...BUSINESS_COLUMNS,
  {
    title: '操作',
    key: 'action',
    width: 240,
    fixed: 'right',
    render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
        {record.status === 0 && (
          <>
            <Popconfirm title="确定通过该申请吗？" onConfirm={() => handleApprove(record.id)} okText="确定" cancelText="取消">
              <Button type="link" size="small" icon={<CheckOutlined />}>通过</Button>
            </Popconfirm>
            <Popconfirm title="确定拒绝该申请吗？" onConfirm={() => handleReject(record.id)} okText="确定" cancelText="取消">
              <Button type="link" size="small" danger icon={<CloseOutlined />}>拒绝</Button>
            </Popconfirm>
          </>
        )}
      </Space>
    ),
  },
];

/**
 * 生成我发起的审批表格列配置
 * @param {Object} callbacks - 回调函数对象，包含 handleViewDetail（查看详情）
 * @returns {Array} 表格列配置数组
 */
export const getMyApprovalColumns = ({ handleViewDetail }) => [
  {
    title: '申请编号',
    dataIndex: 'id',
    key: 'id',
    width: 180,
    ellipsis: true,
  },
  ...BUSINESS_COLUMNS,
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
    ),
  },
];

/**
 * 生成全部审批表格列配置
 * @param {Object} callbacks - 回调函数对象，包含 handleViewDetail（查看详情）
 * @returns {Array} 表格列配置数组
 */
export const getAllApprovalColumns = ({ handleViewDetail }) => [
  {
    title: '申请编号',
    dataIndex: 'id',
    key: 'id',
    width: 180,
    ellipsis: true,
  },
  {
    title: '申请人',
    dataIndex: 'applicantName',
    key: 'applicantName',
    width: 100,
  },
  ...BUSINESS_COLUMNS,
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
    ),
  },
];

/**
 * 生成审批流程配置表格列配置
 * @param {Object} callbacks - 回调函数对象，包含 handleEdit（编辑）、handleDelete（删除）
 * @returns {Array} 表格列配置数组
 */
export const getApprovalFlowColumns = ({ handleEdit, handleDelete }) => [
  {
    title: '流程ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '流程名称（中文）',
    dataIndex: 'nameCn',
    key: 'nameCn',
    width: 200,
  },
  {
    title: '流程名称（英文）',
    dataIndex: 'nameEn',
    key: 'nameEn',
    width: 200,
  },
  {
    title: '审批类型',
    dataIndex: 'code',
    key: 'approvalType',
    width: 120,
    render: (code) => (
      <Tag color={code === 'global' ? 'green' : 'blue'}>
        {code === 'global' ? '全局审批' : '场景审批'}
      </Tag>
    ),
  },
  {
    title: '流程代码',
    dataIndex: 'code',
    key: 'code',
    width: 180,
    render: (code) => (
      <Tag color="blue">{code}</Tag>
    ),
  },
  {
    title: '审批节点数',
    dataIndex: 'nodes',
    key: 'nodes',
    width: 100,
    render: (nodes) => nodes?.length || 0,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status) => (
      <Tag color={status === 1 ? 'green' : 'default'}>
        {status === 1 ? '启用' : '禁用'}
      </Tag>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          删除
        </Button>
      </Space>
    ),
  },
];
