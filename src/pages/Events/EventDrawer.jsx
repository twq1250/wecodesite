import React, { useState, useEffect } from 'react';
import { Drawer, Table, Button, Pagination, Tag, message } from 'antd';
import { fetchAllEvents } from './thunk';
import { PAGE_SIZE_OPTIONS, INIT_PAGINATION } from '../../utils/constants';
import { openUrl } from '../../utils/common';
import { getEventDrawerColumns } from './constants';
import './EventDrawer.m.less';

function EventDrawer({ open, onClose, onConfirm, selectedEvents = [], subscribeLoading = false }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState(
    selectedEvents.map(e => e.id)
  );
  const [pagination, setPagination] = useState(INIT_PAGINATION);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * 加载事件列表
   */
  const loadData = async (page = pagination.curPage, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const result = await fetchAllEvents({ curPage: page, pageSize: size });
      if (result && result.code === '200') {
        setAllEvents(result.data || []);
        setPagination(prev => ({
          ...prev,
          curPage: page,
          pageSize: size,
          total: result.page?.total || 0
        }));
      } else {
        message.error(result?.message || '加载事件列表失败');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 抽屉打开时加载数据
   */
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const handlePageChange = async (page, size) => {
    await loadData(page, size);
  };

  const handleSelectChange = (keys) => {
    setSelectedRowKeys(keys);
  };

  const handleConfirm = () => {
    const selected = allEvents.filter(event => 
      selectedRowKeys.includes(event.id)
    );
    onConfirm(selected);
    setSelectedRowKeys([]);
    setPagination(INIT_PAGINATION);
    onClose();
  };

  const renderEventName = (text, record) => {
    const name = record.nameCn || record.name || '-';
    return (
      <div>
        <div>{name}</div>
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>{record.topic}</span>
      </div>
    );
  };

  const renderNeedApproval = (needApproval, record) => {
    const val = needApproval !== undefined ? needApproval : record.needReview;
    return val ? 
      <Tag color="orange">需要审核</Tag> : 
      <Tag color="green">无需审核</Tag>;
  };

  const renderAction = (_, record) => {
    const docUrl = record.event?.docUrl || record.docUrl;
    return (
      <Button type="link" size="small" onClick={() => openUrl(docUrl)}>
        查看文档
      </Button>
    );
  };

  const columns = getEventDrawerColumns({
    renderEventName,
    renderNeedApproval,
    renderAction,
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  };

  return (
    <Drawer
      title="添加事件"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
      className="event-drawer"
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>取消</Button>
          <Button 
            type="primary" 
            disabled={selectedRowKeys.length === 0 || subscribeLoading}
            loading={subscribeLoading}
            onClick={handleConfirm}
          >
            确认添加
          </Button>
        </div>
      }
    >
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={allEvents}
        rowKey="id"
        pagination={false}
        loading={loading}
      />
      <div className="drawer-pagination">
        <span className="pagination-total">共 {pagination.total} 条</span>
        <Pagination
          current={pagination.curPage}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showQuickJumper
        />
      </div>
    </Drawer>
  );
}

export default EventDrawer;
