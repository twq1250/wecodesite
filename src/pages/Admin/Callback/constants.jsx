import React from 'react';
import { adminTableBaseColumn } from '../../../utils/commonTableConfigs';

export const pageInfo = {
  title: '回调管理',
  description: '管理回调接口，配置回调地址',
  addButtonText: '注册回调',
};

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