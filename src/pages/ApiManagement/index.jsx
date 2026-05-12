import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import PageHeader from '../../components/PageHeader/PageHeader';
import PageList from '../../components/PageList/PageList';
import ResourceDrawer from '../../components/ResourceManagement/ResourceDrawer';
import ApprovalAddressModal from '../../components/ApprovalAddressModal/ApprovalAddressModal';
import ActionConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import { fetchAppApis, subscribeApis, withdrawApiApplication, deleteApiSubscription, fetchCategories, fetchApis, fetchTabConfig } from './thunk';
import { TAB_CONFIG_SEARCH_KEY, pageInfo } from './constants';
import { createApiManagementColumns, createApiDrawerColumns } from '../../utils/commonTableConfigs';
import { queryParams, transformCategoriesToModules, getPageClassPrefix } from '../../utils/common';
import { mockAppInfo } from '../BasicInfo/mock';
import { INIT_PAGECONFIG } from '../../utils/constants';
import './ApiManagement.m.less';

function ApiManagement() {
  const appId = queryParams('appId');

  // ==================== 状态 ====================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [currentApprovalInfo, setCurrentApprovalInfo] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [currentWithdrawRecord, setCurrentWithdrawRecord] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // ==================== 方法定义 ====================

  // 加载列表数据
  const loadData = async (page = 1, size = pagination.pageSize) => {
    if (!appId) return;
    setLoading(true);
    
    const result = await fetchAppApis(appId, { curPage: page, pageSize: size });
    
    if (result && result.code === '200') {
      setData(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: result.page?.total || 0,
        curPage: page,
        pageSize: size
      }));
    } else {
      message.error(result?.message || '加载列表失败');
    }
    
    setLoading(false);
  };

  // 分页变化
  const handlePageChange = (page, size) => {
    loadData(page, size);
  };

  // 打开抽屉
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  // 订阅操作
  const handleSubscribe = async (selectedItems) => {
    if (!appId) return;
    const permissionIds = selectedItems.filter(item => item.id).map(item => item.id);
    if (permissionIds.length === 0) {
      message.warning('没有可订阅的权限');
      return;
    }
    setSubscribeLoading(true);
    
    const res = await subscribeApis(appId, { permissionIds });
    
    if (res && res.code === '200') {
      message.success('申请已提交');
      loadData(1, INIT_PAGECONFIG.pageSize);
      setDrawerOpen(false);
    } else {
      message.error(res?.message || '申请失败');
    }
    
    setSubscribeLoading(false);
  };

  // 复制审批地址
  const handleCopyApprovalAddress = (record) => {
    setCurrentApprovalInfo({
      id: record.id,
      approver: record.approver?.userName || '待分配',
      approvalUrl: record.approvalUrl || ''
    });
    setApprovalModalOpen(true);
  };
  const closeApprovalModal = () => setApprovalModalOpen(false);

  // 删除操作
  const handleDeleteClick = (id) => {
    setCurrentDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;
    setDeleteLoading(true);
    
    const res = await deleteApiSubscription(appId, currentDeleteId);
    
    if (res && res.code === '200') {
      message.success('删除成功');
      setDeleteModalOpen(false);
      loadData(pagination.curPage);
    } else {
      message.error(res?.message || '删除失败');
    }
    
    setDeleteLoading(false);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  // 撤回操作
  const handleWithdraw = (record) => {
    setCurrentWithdrawRecord(record);
    setWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!currentWithdrawRecord) return;
    setWithdrawLoading(true);
    
    const res = await withdrawApiApplication(appId, currentWithdrawRecord.id);
    
    if (res && res.code === '200') {
      message.success('已撤回');
      setWithdrawModalOpen(false);
      setCurrentWithdrawRecord(null);
      loadData(pagination.curPage);
    } else {
      message.error(res?.message || '撤回失败');
    }
    
    setWithdrawLoading(false);
  };
  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
    setCurrentWithdrawRecord(null);
  };

  // ==================== 初始化加载 ====================
  useEffect(() => {
    if (appId) {
      loadData();
    }
  }, [appId]);

  // ==================== 暴露方法给子组件 ====================
  const exposedMethods = {
    handleCopyApprovalAddress,
    handleWithdraw,
    handleDeleteClick,
  };

  // ==================== 表格列配置 ====================
  const columns = createApiManagementColumns().map(col => {
    if (col.render && typeof col.render === 'function') {
      const originalRender = col.render;
      return {
        ...col,
        render: (text, record) => originalRender(text, record, exposedMethods)
      };
    }
    return col;
  });

  // ==================== 渲染 ====================
  return (
    <div className={getPageClassPrefix('api')}>
      <PageHeader
        title={pageInfo.title}
        description={pageInfo.description}
        buttonText={pageInfo.addButtonText}
        onButtonClick={openDrawer}
        linkText={pageInfo.linkText}
        linkUrl={pageInfo.linkUrl}
      />

      <PageList
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          curPage: pagination.curPage,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onPageChange={handlePageChange}
      />

      <ApprovalAddressModal
        open={approvalModalOpen}
        onClose={closeApprovalModal}
        approver={currentApprovalInfo.approver}
        approvalUrl={currentApprovalInfo.approvalUrl}
      />

      <ActionConfirmModal
        type="delete"
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <ActionConfirmModal
        type="withdraw"
        open={withdrawModalOpen}
        onClose={closeWithdrawModal}
        onConfirm={handleConfirmWithdraw}
        loading={withdrawLoading}
      />

      <ResourceDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onConfirm={handleSubscribe}
        title="开通权限"
        className="api-drawer"
        appId={appId}
        fetchCategories={fetchCategories}
        fetchData={fetchApis}
        getColumns={createApiDrawerColumns}
        showAdvancedFeatures={true}
        selectedItems={data}
        subscribeLoading={subscribeLoading}
        placeholder="权限名称/Scope"
        advancedConfig={{
          fetchTabConfig: fetchTabConfig,
          tabSearchKey: TAB_CONFIG_SEARCH_KEY,
          mockAppInfo: mockAppInfo,
          transformModules: transformCategoriesToModules,
        }}
      />
    </div>
  );
}

export default ApiManagement;
