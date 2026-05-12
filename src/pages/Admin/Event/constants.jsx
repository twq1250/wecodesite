import React from 'react';
import { adminTableBaseColumn } from '../../../utils/commonTableConfigs';

export const pageInfo = {
  title: '事件管理',
  description: '管理事件定义，配置事件订阅',
  addButtonText: '注册事件',
};

export const getEventListColumns = ({ handleView, handleEdit, handleDelete }) => {
  const baseColumn = adminTableBaseColumn({ handleView, handleEdit, handleDelete });
  return [
    {
      title: '事件名称',
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
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: 200,
      ellipsis: true,
      render: (text) => <code>{text}</code>,
    },
    ...baseColumn,
  ];
};
