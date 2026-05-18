/**
 * Admin模块 - API管理页面组件
 * 功能：管理员视角的API列表管理，支持API的创建、查看、编辑和删除操作
 */
import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { fetchApiList, deleteApi, fetchApiDetail, createApi, updateApi } from './thunk';
import { fetchCategoryTree } from '../Category/thunk';
import AdminTableToolbar from '../../../components/AdminTableToolbar/AdminTableToolbar';
import PageList from '../../../components/PageList/PageList';
import ResourceRegister from '../../../components/ResourceRegister/ResourceRegister';
import SimpleSidebar from '../../../components/SimpleSidebar/SimpleSidebar';
import { pageInfo, getApiListColumns } from './constants';
import { INIT_PAGECONFIG, PROPERTY_PRESETS } from '../../../utils/constants';
import './ApiList.m.less';

/**
 * API管理列表页面组件
 * 提供API的增删改查功能，支持分类筛选和状态筛选
 */
function ApiList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [mode, setMode] = useState('create');

  const apiList = data;

  const loadCategories = async () => {
    const result = await fetchCategoryTree();
    if (result && result.code === '200') {
      setCategories(result.data || []);
    } else {
      message.error(result?.message || '加载分类失败');
    }
  };

  const loadData = async (params = {}) => {
    setLoading(true);
    const finalKeyword = params.keyword ?? keyword;
    const finalCategoryId = params.categoryId ?? categoryId;
    const finalStatus = params.status ?? status;
    const finalPage = params.curPage ?? pagination.curPage;
    const finalSize = params.pageSize ?? pagination.pageSize;

    const result = await fetchApiList({
      keyword: finalKeyword,
      categoryId: finalCategoryId,
      status: finalStatus,
      curPage: finalPage,
      pageSize: finalSize,
    });

    if (result && result.code === '200') {
      setData(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: result.page?.total || 0,
        curPage: finalPage,
        pageSize: finalSize
      }));
    } else {
      message.error(result?.message || '加载列表失败');
    }

    setLoading(false);
  };

  const handleSearch = () => {
    loadData({ curPage: 1 });
  };

  const handlePageChange = (page, size) => {
    loadData({ curPage: page, pageSize: size });
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    loadData({ categoryId: value });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    loadData({ status: value });
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setMode('create');
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentItem({ id: record.id });
    setMode('edit');
    setModalVisible(true);
  };

  const handleView = (record) => {
    setCurrentItem({ id: record.id });
    setMode('view');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const res = await deleteApi(id);
    if (res && res.code === '200') {
      message.success('删除成功');
      loadData();
    } else {
      message.error(res?.message || '删除失败');
    }
  };

  const handleSuccess = () => {
    setModalVisible(false);
    loadData();
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentItem(null);
  };

  useEffect(() => {
    loadCategories();
    loadData();
  }, []);

  const columns = getApiListColumns({
    handleView,
    handleEdit,
    handleDelete,
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SimpleSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="api-management-page">
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
            placeholder="搜索API名称"
            categoryId={categoryId}
            categories={categories}
            onCategoryChange={handleCategoryChange}
            status={status}
            onStatusChange={handleStatusChange}
          />

          <PageList
            columns={columns}
            dataSource={apiList}
            loading={loading}
            pagination={{
              curPage: pagination.curPage,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onPageChange={handlePageChange}
          />

          <ResourceRegister
            visible={modalVisible}
            resource={currentItem}
            resourceType="api"
            thunk={{
              fetchDetail: fetchApiDetail,
              create: createApi,
              update: updateApi,
            }}
            propertyPresets={PROPERTY_PRESETS}
            mode={mode}
            onSuccess={handleSuccess}
            onCancel={closeModal}
          />
        </div>
      </div>
    </div>
  );
}

export default ApiList;
