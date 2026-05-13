/**
 * 回调配置页面组件
 * 功能：应用视角的回调订阅管理，支持回调的订阅、配置、撤回、删除和审批地址复制
 */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { queryParams, getPageClassPrefix } from '../../utils/common';
import { INIT_PAGECONFIG } from '../../utils/constants';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageList from '../../components/PageList/PageList';
import ResourceDrawer from '../../components/ResourceManagement/ResourceDrawer';
import ApprovalAddressModal from '../../components/ApprovalAddressModal/ApprovalAddressModal';
import ActionConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import SubscriptionConfigDrawer from '../../components/ResourceManagement/SubscriptionConfigDrawer';
import { withdrawApproval, deleteAppCallbackSubscription, subscribeCallbacks, fetchAppCallbacks, fetchCallbackCategories, fetchCallbacks, configCallbackSubscription } from './thunk';
import { createCallbackDrawerColumns, createCallbackColumns } from '../../utils/commonTableConfigs';
import { pageInfo } from './constants';
import './Callbacks.m.less';

/**
 * 回调配置页面组件
 * 提供应用回调订阅功能，支持订阅申请、配置、撤回和删除已订阅的回调
 */
function Callbacks() {
  const appId = queryParams('appId');
  
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [currentWithdrawRecord, setCurrentWithdrawRecord] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [currentApprovalInfo, setCurrentApprovalInfo] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [callbackList, setCallbackList] = useState([]);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  const [loading, setLoading] = useState(false);
  const [editingCallback, setEditingCallback] = useState(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);

  const loadCallbackList = async (pageNum = 1, pageSize = pagination.pageSize) => {
    if (!appId) return;
    setLoading(true);
    
    const response = await fetchAppCallbacks(appId, { curPage: pageNum, pageSize: pageSize });
    
    if (response && response.code === '200') {
      setCallbackList(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.page?.total || 0,
        pageSize: pageSize,
        curPage: pageNum
      }));
    } else {
      message.error(response?.message || '加载列表失败');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (appId) {
      loadCallbackList();
    }
  }, [appId]);

  const handlePageChange = (page, size) => {
    loadCallbackList(page, size);
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const handleSubscribe = async (selectedItems) => {
    if (!appId) return;
    const permissionIds = selectedItems.filter(item => item.id).map(item => item.id);
    if (permissionIds.length === 0) {
      message.warning('没有可订阅的权限');
      return;
    }
    setSubscribeLoading(true);
    
    const response = await subscribeCallbacks(appId, { permissionIds });
    
    if (response && response.code === '200') {
      message.success('申请已提交');
      setDrawerOpen(false);
      loadCallbackList(1, INIT_PAGECONFIG.pageSize);
    } else {
      message.error(response?.message || '申请失败');
    }
    
    setSubscribeLoading(false);
  };

  const handleCopyApprovalAddress = (record) => {
    setCurrentApprovalInfo({
      id: record.id,
      approver: record.approver?.userName || '待分配',
      approvalUrl: record.approvalUrl || ''
    });
    setApprovalModalOpen(true);
  };

  const closeApprovalModal = () => setApprovalModalOpen(false);

  const handleDeleteClick = (id) => {
    setDeleteModalOpen(true);
    setCurrentDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;
    setDeleteLoading(true);
    
    const response = await deleteAppCallbackSubscription(appId, currentDeleteId);
    
    if (response && response.code === '200') {
      message.success('删除成功');
      setDeleteModalOpen(false);
      loadCallbackList(pagination.curPage);
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
      loadCallbackList(pagination.curPage);
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
    setEditingCallback(record);
  };

  const handleConfigSave = () => {
    loadCallbackList(pagination.curPage);
  };

  const actionCallbacks = {
    handleCopyApprovalAddress,
    handleDeleteClick,
    handleWithdraw,
    handleEdit,
  };

  const columns = createCallbackColumns().map(col => {
    if (col.key === 'action' && col.render) {
      const originalRender = col.render;
      return {
        ...col,
        render: (text, record) => originalRender(text, record, actionCallbacks)
      };
    }
    return col;
  });

  return (
    <div className={getPageClassPrefix('callback')}>
      <PageHeader
        onButtonClick={openDrawer}
        buttonText={pageInfo.addButtonText}
        linkText={pageInfo.linkText}
        linkUrl={pageInfo.linkUrl}
        title={pageInfo.title}
        description={pageInfo.description}
      />

      <PageList
        loading={loading}
        columns={columns}
        dataSource={callbackList}
        onPageChange={handlePageChange}
        pagination={{
          pageSize: pagination.pageSize,
          total: pagination.total,
          curPage: pagination.curPage,
        }}
      />

      <ApprovalAddressModal
        approvalUrl={currentApprovalInfo.approvalUrl}
        approver={currentApprovalInfo.approver}
        open={approvalModalOpen}
        onClose={closeApprovalModal}
      />

      <ActionConfirmModal
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        type="delete"
        open={deleteModalOpen}
      />

      <ActionConfirmModal
        loading={withdrawLoading}
        onConfirm={handleConfirmWithdraw}
        onClose={closeWithdrawModal}
        type="withdraw"
        open={withdrawModalOpen}
      />

      <SubscriptionConfigDrawer
        onSave={handleConfigSave}
        onClose={() => {
          setEditingCallback(null);
          setConfigDrawerOpen(false);
        }}
        item={editingCallback}
        itemType="callback"
        configThunk={configCallbackSubscription}
        open={configDrawerOpen}
      />

      <ResourceDrawer
        selectedItems={callbackList}
        subscribeLoading={subscribeLoading}
        onConfirm={handleSubscribe}
        onClose={closeDrawer}
        appId={appId}
        fetchCategories={fetchCallbackCategories}
        fetchData={fetchCallbacks}
        getColumns={createCallbackDrawerColumns}
        showAdvancedFeatures={false}
        title="添加回调"
        className="callback-drawer"
        open={drawerOpen}
        placeholder="回调名称/Scope"
      />
    </div>
  );
}

export default Callbacks;
