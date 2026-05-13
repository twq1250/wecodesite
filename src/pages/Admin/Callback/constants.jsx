/**
 * Admin模块 - 回调管理页面常量配置
 * 定义页面元信息和表格列配置
 */
import React from 'react';
import { adminTableBaseColumn } from '../../../utils/commonTableConfigs';

/**
 * 页面元信息配置
 */
export const pageInfo = {
  title: '回调管理',
  description: '管理回调接口，配置回调地址',
  addButtonText: '注册回调',
};

/**
 * 生成回调列表表格列配置
 * @param {Object} callbacks - 回调函数对象，包含 handleView（查看）、handleEdit（编辑）、handleDelete（删除）
 * @returns {Array} 表格列配置数组
 */
export const getCallbackListColumns = ({ handleView, handleEdit, handleDelete }) => {
  const baseColumn = adminTableBaseColumn({ handleView, handleEdit, handleDelete });
  return [
    {
      title: '回调名称',
      dataIndex: 'nameCn',
      key: 'nameCn',
      width: 180,
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.nameEn}</div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
    },
    ...baseColumn,
  ];
};