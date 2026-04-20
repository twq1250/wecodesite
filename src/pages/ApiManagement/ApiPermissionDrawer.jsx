import React, { useState, useEffect } from 'react';
import { Drawer, Tabs, Table, Button, Tag, Pagination, Input, Select } from 'antd';
import { fetchFilteredApis, fetchApiModules } from './thunk';
import './ApiPermissionDrawer.m.less';

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const NEED_REVIEW_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'true', label: '需要审核' },
  { value: 'false', label: '无需审核' },
];

function ApiPermissionDrawer({ open, onClose, onConfirm }) {
  const [activeType, setActiveType] = useState('SOA');
  const [activeModule, setActiveModule] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [apisData, setApisData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterNeedReview, setFilterNeedReview] = useState('all');

  useEffect(() => {
    const loadModules = async () => {
      const modules = await fetchApiModules(activeType);
      setModulesData(modules);
    };
    loadModules();
  }, [activeType]);

  useEffect(() => {
    const loadFilteredApis = async () => {
      setLoading(true);
      const apis = await fetchFilteredApis({
        auth: activeType,
        name: filterName,
        scope: filterScope,
        needReview: filterNeedReview,
      });
      setApisData(apis);
      setLoading(false);
    };
    loadFilteredApis();
  }, [activeType, filterName, filterScope, filterNeedReview]);

  useEffect(() => {
    if (open) {
      setActiveType('SOA');
      setActiveModule('all');
      setFilterName('');
      setFilterScope('');
      setFilterNeedReview('all');
      setCurrentPage(1);
      setSelectedRowKeys([]);
    }
  }, [open]);

  const modules = modulesData;

  const filteredApis = () => {
    if (activeModule === 'all') {
      return apisData;
    }
    const moduleItem = modules.find(m => m.key === activeModule);
    if (moduleItem) {
      return apisData.filter(api => api.category === moduleItem.name);
    }
    return apisData;
  };

  const paginatedApis = () => {
    const data = filteredApis();
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  };

  const handleModuleClick = ({ key }) => {
    setActiveModule(key);
    setCurrentPage(1);
    setSelectedRowKeys([]);
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setActiveModule('all');
    setFilterName('');
    setFilterCodeName('');
    setFilterNeedReview('all');
    setCurrentPage(1);
    setSelectedRowKeys([]);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSelectChange = (keys) => {
    setSelectedRowKeys(keys);
  };

  const handleConfirm = () => {
    const selectedApis = apisData.filter(api => selectedRowKeys.includes(api.id));
    onConfirm(selectedApis);
    setSelectedRowKeys([]);
    setCurrentPage(1);
    onClose();
  };

  const handleDocClick = (url) => {
    window.open(url, '_blank');
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleScopeChange = (e) => {
    setFilterScope(e.target.value);
    setCurrentPage(1);
  };

  const handleNeedReviewChange = (value) => {
    setFilterNeedReview(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'scope',
      dataIndex: 'scope',
      key: 'scope',
      render: (scope) => <code>{scope}</code>,
    },
    {
      title: '是否需要审核',
      dataIndex: 'needReview',
      key: 'needReview',
      render: (needReview) => (
        needReview
          ? <Tag color="orange">需要审核</Tag>
          : <Tag color="green">无需审核</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleDocClick(record.docUrl)}
        >
          查看文档
        </Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  const currentFilteredApis = filteredApis();

  return (
    <Drawer
      title="开通权限"
      placement="right"
      width={900}
      onClose={onClose}
      open={open}
      className="api-permission-drawer"
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>取消</Button>
          <Button
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={handleConfirm}
          >
            确认开通权限
          </Button>
        </div>
      }
    >
      <div className="drawer-content">
        <Tabs
          activeKey={activeType}
          onChange={handleTypeChange}
          items={[
            { key: 'SOA', label: 'SOA类型' },
            { key: 'APIG', label: 'APIG类型' },
          ]}
        />
        <div className="drawer-filter">
          <Input
            placeholder="权限名称"
            value={filterName}
            onChange={handleFilterChange(setFilterName)}
            style={{ width: 150 }}
            allowClear
          />
          <Input
            placeholder="scope"
            value={filterScope}
            onChange={handleScopeChange}
            style={{ width: 150 }}
            allowClear
          />
          <Select
            placeholder="是否需要审核"
            value={filterNeedReview}
            onChange={handleNeedReviewChange}
            options={NEED_REVIEW_OPTIONS}
            style={{ width: 150 }}
          />
        </div>
        <div className="drawer-main">
          <div className="drawer-sidebar">
            <ul className="module-list">
              {modules.map(module => (
                <li
                  key={module.key}
                  className={`module-item ${activeModule === module.key ? 'active' : ''}`}
                  onClick={() => handleModuleClick({ key: module.key })}
                >
                  {module.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="drawer-table">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={paginatedApis()}
              rowKey="id"
              pagination={false}
              loading={loading}
            />
            <div className="drawer-pagination">
              <span className="pagination-total">共 {currentFilteredApis.length} 条</span>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={currentFilteredApis.length}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                showQuickJumper
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default ApiPermissionDrawer;
