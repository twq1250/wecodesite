/**
 * Admin模块 - 回调管理页面组件
 * 功能：管理员视角的回调列表管理，支持回调的创建、查看、编辑和删除操作
 */
import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { fetchCategoryTree } from '../Category/thunk';
import { fetchCallbackList, createCallback, updateCallback, fetchCallbackDetail, deleteCallback } from './thunk';
import AdminTableToolbar from '../../../components/AdminTableToolbar/AdminTableToolbar';
import PageList from '../../../components/PageList/PageList';
import ResourceRegister from '../../../components/ResourceRegister';
import SimpleSidebar from '../../../components/SimpleSidebar/SimpleSidebar';
import { getCallbackListColumns } from './constants';
import { PROPERTY_PRESETS, INIT_PAGECONFIG } from '../../../utils/constants';
import './CallbackList.m.less';
import { pageInfo } from './constants';

/**
 * 回调管理列表页面组件
 * 提供回调的增删改查功能，支持分类筛选和状态筛选
 */
function CallbackList() {
  const [mode, setMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const callbackRecords = records;

  useEffect(() => {
    loadCategories();
    loadRecords();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchCategoryTree();
      if (res && res.code === '200') {
        setCategories(res.data || []);
      } else {
        message.error(res?.message || '加载分类失败');
      }
    } catch (err) {
      message.error('加载分类异常');
    }
  };

  const loadRecords = async (query = {}) => {
    setLoading(true);
    const queryParams = {
      keyword: query.keyword ?? keyword,
      categoryId: query.categoryId ?? categoryId,
      status: query.status ?? status,
      curPage: query.curPage ?? pagination.curPage,
      pageSize: query.pageSize ?? pagination.pageSize,
    };

    try {
      const res = await fetchCallbackList(queryParams);
      if (res && res.code === '200') {
        setRecords(res.data || []);
        setPagination(prev => ({
          ...prev,
          total: res.page?.total || 0,
          curPage: queryParams.curPage,
          pageSize: queryParams.pageSize
        }));
      } else {
        message.error(res?.message || '加载列表失败');
      }
    } catch (err) {
      message.error('加载列表异常');
    }

    setLoading(false);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    loadRecords({ status: val });
  };

  const handleCategoryChange = (val) => {
    setCategoryId(val);
    loadRecords({ categoryId: val });
  };

  const handlePageChange = (page, size) => {
    loadRecords({ curPage: page, pageSize: size });
  };

  const handleSearch = () => {
    loadRecords({ curPage: 1 });
  };

  const handleView = (record) => {
    setCurrentItem({ id: record.id });
    setMode('view');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setMode('create');
    setCurrentItem(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setMode('edit');
    setCurrentItem({ id: record.id });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCallback(id);
      if (res && res.code === '200') {
        message.success('删除成功');
        loadRecords();
      } else {
        message.error(res?.message || '删除失败');
      }
    } catch (err) {
      message.error('删除异常');
    }
  };

  const closeModal = () => {
    setCurrentItem(null);
    setModalVisible(false);
  };

  const handleSuccess = () => {
    loadRecords();
    setModalVisible(false);
  };

  const columns = getCallbackListColumns({
    handleDelete,
    handleEdit,
    handleView,
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SimpleSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="callback-management-page">
          <div className="page-header">
            <div className="page-header-left">
              <h4 className="page-title">{pageInfo.title}</h4>
              <span className="page-desc">{pageInfo.description}</span>
            </div>
            <Button type="primary" onClick={handleAdd} style={{ justifyContent: 'center', borderRadius: 6 }}>
              {pageInfo.addButtonText}
            </Button>
          </div>

          <AdminTableToolbar
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearch={handleSearch}
            placeholder="搜索回调名称"
            status={status}
            onStatusChange={handleStatusChange}
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={handleCategoryChange}
          />

          <PageList
            columns={columns}
            dataSource={callbackRecords}
            loading={loading}
            pagination={{
              pageSize: pagination.pageSize,
              total: pagination.total,
              curPage: pagination.curPage,
            }}
            onPageChange={handlePageChange}
          />

          <ResourceRegister
            thunk={{
              update: updateCallback,
              create: createCallback,
              fetchDetail: fetchCallbackDetail,
            }}
            mode={mode}
            onSuccess={handleSuccess}
            propertyPresets={PROPERTY_PRESETS}
            onCancel={closeModal}
            resourceType="callback"
            resource={currentItem}
            visible={modalVisible}
          />
        </div>
      </div>
    </div>
  );
}

export default CallbackList;
