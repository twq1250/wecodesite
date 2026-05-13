/**
 * Admin模块 - 分类管理页面常量配置
 * 定义表格列配置
 */
import React from 'react';
import { Button } from 'antd';

/**
 * 生成分类负责人表格列配置
 * @param {Function} handleRemoveOwner - 移除负责人回调函数
 * @returns {Array} 表格列配置数组
 */
export const getOwnerColumns = (handleRemoveOwner) => [
  { title: '用户ID', dataIndex: 'userId', key: 'userId', width: 150 },
  { title: '用户名称', dataIndex: 'userName', key: 'userName', width: 200 },
  {
    title: '操作',
    key: 'action',
    width: 100,
    render: (_, record) => (
      <Button type="link" danger size="small" onClick={() => handleRemoveOwner(record.userId)}>
        移除
      </Button>
    ),
  },
];
