/**
 * Admin模块 - 事件管理页面组件
 * 功能：管理员视角的事件列表管理，支持事件的创建、查看、编辑和删除操作
 */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { message, Button } from 'antd';
import { fetchCategoryTree } from '../Category/thunk';
import { updateEvent, createEvent, fetchEventDetail, fetchEventList, deleteEvent } from './thunk';
import AdminTableToolbar from '../../../components/AdminTableToolbar/AdminTableToolbar';
import PageList from '../../../components/PageList/PageList';
import ResourceRegister from '../../../components/ResourceRegister/ResourceRegister';
import SimpleSidebar from '../../../components/SimpleSidebar/SimpleSidebar';
import { PROPERTY_PRESETS, INIT_PAGECONFIG } from '../../../utils/constants';
import { getEventListColumns } from './constants';
import { pageInfo } from './constants';
import './EventList.m.less';

/**
 * 事件管理列表页面组件
 * 提供事件的增删改查功能，支持分类筛选和状态筛选
 */
function EventList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [mode, setMode] = useState('create');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);

  const eventList = eventData;

  const loadCategories = async () => {
    const result = await fetchCategoryTree();
    if (result && result.code === '200') {
      setCategories(result.data || []);
    } else {
      message.error(result?.messageZh || result?.message || '加载分类失败');
    }
  };

  const loadEventData = async (searchParams = {}) => {
    setLoading(true);
    
    const mergedParams = {
      keyword: searchParams.keyword ?? keyword,
      categoryId: searchParams.categoryId ?? categoryId,
      status: searchParams.status ?? status,
      curPage: searchParams.curPage ?? pagination.curPage,
      pageSize: searchParams.pageSize ?? pagination.pageSize,
    };

    const result = await fetchEventList(mergedParams);

    if (result && result.code === '200') {
      setEventData(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: result.page?.total || 0,
        curPage: mergedParams.curPage,
        pageSize: mergedParams.pageSize
      }));
    } else {
      message.error(result?.messageZh || result?.message || '加载列表失败');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    loadEventData();
  }, []);

  const handleAdd = () => {
    setModalVisible(true);
    setCurrentItem(null);
    setMode('create');
  };

  const handleView = (record) => {
    setModalVisible(true);
    setCurrentItem({ id: record.id });
    setMode('view');
  };

  const handleEdit = (record) => {
    setModalVisible(true);
    setCurrentItem({ id: record.id });
    setMode('edit');
  };

  const handleDelete = async (id) => {
    const response = await deleteEvent(id);
    if (response && response.code === '200') {
      message.success('删除成功');
      loadEventData();
    } else {
      message.error(response?.message || '删除失败');
    }
  };

  const handleSearch = () => {
    loadEventData({ curPage: 1 });
  };

  const handlePageChange = (page, size) => {
    loadEventData({ curPage: page, pageSize: size });
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    loadEventData({ categoryId: value });
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    loadEventData({ status: value });
  };

  const handleSuccess = () => {
    setModalVisible(false);
    loadEventData();
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentItem(null);
  };

  const columns = getEventListColumns({
    handleDelete,
    handleEdit,
    handleView,
  });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SimpleSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="event-management-page">
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
            onSearch={handleSearch}
            onKeywordChange={setKeyword}
            keyword={keyword}
            onStatusChange={handleStatusChange}
            status={status}
            onCategoryChange={handleCategoryChange}
            categoryId={categoryId}
            categories={categories}
            placeholder="搜索事件名称"
          />

          <PageList
            dataSource={eventList}
            loading={loading}
            columns={columns}
            onPageChange={handlePageChange}
            pagination={{
              curPage: pagination.curPage,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
          />

          <ResourceRegister
            resource={currentItem}
            resourceType="event"
            visible={modalVisible}
            mode={mode}
            thunk={{
              fetchDetail: fetchEventDetail,
              create: createEvent,
              update: updateEvent,
            }}
            propertyPresets={PROPERTY_PRESETS}
            onCancel={closeModal}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default EventList;
