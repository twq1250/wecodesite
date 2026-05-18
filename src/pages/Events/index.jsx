/**
 * 事件配置页面组件
 * 功能：应用视角的事件订阅管理，支持事件的订阅、配置、撤回、删除和审批地址复制
 */
import React from 'react';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { queryParams, getPageClassPrefix } from '../../utils/common';
import { INIT_PAGECONFIG } from '../../utils/constants';
import { createEventDrawerColumns, createEventColumns } from '../../utils/commonTableConfigs';
import ApprovalAddressModal from '../../components/ApprovalAddressModal/ApprovalAddressModal';
import ActionConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageList from '../../components/PageList/PageList';
import SubscriptionConfigDrawer from '../../components/ResourceManagement/SubscriptionConfigDrawer';
import ResourceDrawer from '../../components/ResourceManagement/ResourceDrawer';
import { pageInfo } from './constants';
import { withdrawApproval, deleteAppEventSubscription, subscribeEvents, fetchAppEvents, fetchEventCategories, fetchEvents, configEventSubscription } from './thunk';
import './Events.m.less';

/**
 * 事件配置页面组件
 * 提供应用事件订阅功能，支持订阅申请、配置、撤回和删除已订阅的事件
 */
function Events() {
  const appId = queryParams('appId');
  
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  const [currentApprovalInfo, setCurrentApprovalInfo] = useState({});
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [currentWithdrawRecord, setCurrentWithdrawRecord] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEventList = async (page = 1, size = pagination.pageSize) => {
    if (!appId) return;
    setLoading(true);
    
    const response = await fetchAppEvents(appId, { curPage: page, pageSize: size });
    
    if (response && response.code === '200') {
      setEventList(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.page?.total || 0,
        curPage: page,
        pageSize: size
      }));
    } else {
      message.error(response?.message || '加载列表失败');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (appId) {
      loadEventList();
    }
  }, [appId]);

  const handlePageChange = (page, size) => {
    loadEventList(page, size);
  };

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  const handleSubscribe = async (selectedItems) => {
    if (!appId) return;
    const permissionIds = selectedItems.filter(item => item.id).map(item => item.id);
    if (permissionIds.length === 0) {
      message.warning('没有可订阅的权限');
      return;
    }
    setSubscribeLoading(true);
    
    const response = await subscribeEvents(appId, { permissionIds });
    
    if (response && response.code === '200') {
      message.success('申请已提交');
      setDrawerOpen(false);
      loadEventList(1, INIT_PAGECONFIG.pageSize);
    } else {
      message.error(response?.message || '申请失败');
    }
    
    setSubscribeLoading(false);
  };

  const handleCopyApprovalAddress = (record) => {
    setApprovalModalOpen(true);
    setCurrentApprovalInfo({
      id: record.id,
      approver: `${record.approver?.userName} ${record.approver?.userId}` || '待分配',
      approvalUrl: record.approvalUrl || ''
    });
  };

  const closeApprovalModal = () => setApprovalModalOpen(false);

  const handleDeleteClick = (id) => {
    setDeleteModalOpen(true);
    setCurrentDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;
    setDeleteLoading(true);
    
    const response = await deleteAppEventSubscription(appId, currentDeleteId);
    
    if (response && response.code === '200') {
      message.success('删除成功');
      setDeleteModalOpen(false);
      loadEventList(pagination.curPage);
    } else {
      message.error(response?.message || '删除失败');
    }
    
    setDeleteLoading(false);
  };

  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleWithdraw = (record) => {
    setWithdrawModalOpen(true);
    setCurrentWithdrawRecord(record);
  };

  const handleConfirmWithdraw = async () => {
    if (!currentWithdrawRecord) return;
    setWithdrawLoading(true);
    
    const response = await withdrawApproval(appId, currentWithdrawRecord.id);
    
    if (response && response.code === '200') {
      message.success('已撤回');
      setWithdrawModalOpen(false);
      setCurrentWithdrawRecord(null);
      loadEventList(pagination.curPage);
    } else {
      message.error(response?.message || '撤回失败');
    }
    
    setWithdrawLoading(false);
  };

  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
    setCurrentWithdrawRecord(null);
  };

  const handleEdit = (record) => {
    setConfigDrawerOpen(true);
    setEditingEvent(record);
  };

  const handleConfigSave = () => {
    loadEventList(pagination.curPage);
  };

  const actionHandlers = {
    handleEdit,
    handleDeleteClick,
    handleWithdraw,
    handleCopyApprovalAddress,
  };

  const columns = createEventColumns().map(col => {
    if (col.key === 'action' && col.render) {
      const originalRender = col.render;
      return {
        ...col,
        render: (text, record) => originalRender(text, record, actionHandlers)
      };
    }
    return col;
  });

  return (
    <div className={getPageClassPrefix('event')}>
      <PageHeader
        description={pageInfo.description}
        title={pageInfo.title}
        onButtonClick={openDrawer}
        buttonText={pageInfo.addButtonText}
        linkText={pageInfo.linkText}
        linkUrl={pageInfo.linkUrl}
      />

      <PageList
        dataSource={eventList}
        loading={loading}
        columns={columns}
        pagination={{
          total: pagination.total,
          pageSize: pagination.pageSize,
          curPage: pagination.curPage,
        }}
        onPageChange={handlePageChange}
      />

      <ApprovalAddressModal
        onClose={closeApprovalModal}
        open={approvalModalOpen}
        approver={currentApprovalInfo.approver}
        approvalUrl={currentApprovalInfo.approvalUrl}
      />

      <ActionConfirmModal
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        type="delete"
        open={deleteModalOpen}
      />

      <ActionConfirmModal
        onConfirm={handleConfirmWithdraw}
        onClose={closeWithdrawModal}
        loading={withdrawLoading}
        type="withdraw"
        open={withdrawModalOpen}
      />

      <SubscriptionConfigDrawer
        open={configDrawerOpen}
        configThunk={configEventSubscription}
        itemType="event"
        item={editingEvent}
        onSave={handleConfigSave}
        onClose={() => {
          setEditingEvent(null);
          setConfigDrawerOpen(false);
        }}
      />

      <ResourceDrawer
        title="添加事件"
        placeholder="事件名称/Topic"
        className="event-drawer"
        appId={appId}
        fetchCategories={fetchEventCategories}
        fetchData={fetchEvents}
        getColumns={createEventDrawerColumns}
        showAdvancedFeatures={false}
        selectedItems={eventList}
        subscribeLoading={subscribeLoading}
        onConfirm={handleSubscribe}
        onClose={closeDrawer}
        open={drawerOpen}
      />
    </div>
  );
}

export default Events;
