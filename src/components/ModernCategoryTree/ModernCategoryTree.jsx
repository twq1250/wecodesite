import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  Tag,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  MoreOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import './ModernCategoryTree.m.less';

const ModernCategoryTree = ({
  data = [],
  loading = false,
  onAddChild,
  onEdit,
  onManageOwners,
  onDelete,
  maxAddLevel = 1,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);

  const handleToggle = (key) => {
    setExpandedKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleExpandAll = () => {
    const allKeys = getAllKeys(data);
    setExpandedKeys(allKeys);
  };

  const handleCollapseAll = () => {
    setExpandedKeys([]);
  };

  const getAllKeys = (nodes, keys = []) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        keys.push(node.id);
        getAllKeys(node.children, keys);
      }
    });
    return keys;
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedKeys.includes(node.id);
    const indentPx = level * 24;
    const canAddChild = level <= maxAddLevel;

    const actionItems = [
      {
        key: 'edit',
        label: '编辑',
        onClick: () => onEdit(node),
      },
      {
        key: 'owner',
        label: '责任人',
        onClick: () => onManageOwners(node),
      },
      {
        key: 'delete',
        label: '删除',
        danger: true,
        onClick: () => onDelete(node),
      },
    ];

    if (canAddChild) {
      actionItems.unshift({
        key: 'add',
        label: '添加子分类',
        onClick: () => onAddChild(node),
      });
    }

    return (
      <div key={node.id} className="tree-node-wrapper">
        <div
          className={`tree-node ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''}`}
          style={{ marginLeft: `${indentPx}px` }}
        >
          <div className="node-content">
            {hasChildren ? (
              <button
                className="expand-btn"
                onClick={() => handleToggle(node.id)}
                aria-label={isExpanded ? '收起' : '展开'}
              >
                {isExpanded ? <DownOutlined /> : <RightOutlined />}
              </button>
            ) : (
              <span className="expand-placeholder" />
            )}

            <span className="node-title">
              {node.categoryAlias && (
                <Tag color="blue" className="alias-tag">
                  {node.categoryAlias}
                </Tag>
              )}
              <span className="name-cn">{node.nameCn}</span>
              {node.nameEn && (
                <span className="name-en">/ {node.nameEn}</span>
              )}
            </span>

            <div className="node-info">
              {hasChildren && (
                <span className="child-count">
                  {node.children.length} 个子分类
                </span>
              )}
            </div>

            <div className="node-actions">
              {canAddChild && (
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => onAddChild(node)}
                  className="action-btn"
                  title="快速添加子分类"
                />
              )}
              <Dropdown
                menu={{ items: actionItems }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  className="action-btn"
                />
              </Dropdown>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="children-container">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modern-category-tree">
      <div className="tree-toolbar">
        <div className="toolbar-right">
          <Button 
            type="text" 
            size="small" 
            onClick={handleExpandAll}
            className="toolbar-btn"
          >
            全部展开
          </Button>
          <span className="toolbar-divider">|</span>
          <Button 
            type="text" 
            size="small" 
            onClick={handleCollapseAll}
            className="toolbar-btn"
          >
            全部收起
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="tree-container">
          {data.length > 0 ? (
            data.map((node) => renderNode(node, 0))
          ) : (
            <Empty description="暂无分类数据" />
          )}
        </div>
      </Spin>
    </div>
  );
};

export default ModernCategoryTree;
