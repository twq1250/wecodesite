/**
 * ========================================
 * 连接器管理 - 列表页面主组件
 * ========================================
 * 
 * 功能：
 * - 展示连接器列表（分页、搜索）
 * - 创建新的连接器
 * - 编辑已有连接器
 * - 删除连接器
 * - 查看连接器详情
 */

import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchConnectorList, deleteConnector } from './thunk';
import AdminTableToolbar from '../../../components/AdminTableToolbar/AdminTableToolbar';
import PageList from '../../../components/PageList/PageList';
import ConnectorModal from './ConnectorModal';
import SimpleSidebar from '../../../components/SimpleSidebar/SimpleSidebar';
import { pageInfo, searchConfig, getConnectorColumns } from './constants';
import { INIT_PAGECONFIG } from '../../../utils/constants';
import './Connector.m.less';

function ConnectorList() {
  /**
   * State定义
   */
  
  // 连接器列表数据
  const [data, setData] = useState([]);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 分页配置
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  
  // 弹窗相关状态
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [mode, setMode] = useState('create'); // create | edit | view

  /**
   * 数据加载
   * @param {Object} params - 请求参数
   */
  const loadData = async (params = {}) => {
    setLoading(true);
    
    // 合并参数
    const finalParams = {
      keyword: params.keyword ?? keyword,
      curPage: params.curPage ?? pagination.curPage,
      pageSize: params.pageSize ?? pagination.pageSize,
    };

    // 调用API
    const result = await fetchConnectorList(finalParams);
    
    if (result && result.code === '200') {
      // 更新列表数据
      setData(result.data || []);
      
      // 更新分页信息
      setPagination(prev => ({
        ...prev,
        total: result.page?.total || 0,
        curPage: finalParams.curPage,
        pageSize: finalParams.pageSize,
      }));
    } else {
      message.error(result?.message || '加载列表失败');
    }
    
    setLoading(false);
  };

  /**
   * 搜索处理
   */
  const handleSearch = () => {
    loadData({ curPage: 1 });
  };

  /**
   * 分页变化处理
   * @param {number} page - 页码
   * @param {number} size - 每页条数
   */
  const handlePageChange = (page, size) => {
    loadData({ curPage: page, pageSize: size });
  };

  /**
   * 关键词变化处理
   * @param {string} value - 关键词
   */
  const handleKeywordChange = (value) => {
    setKeyword(value);
  };

  /**
   * 新建连接器
   */
  const handleAdd = () => {
    setCurrentItem(null);
    setMode('create');
    setModalVisible(true);
  };

  /**
   * 编辑连接器
   * @param {Object} record - 连接器记录
   */
  const handleEdit = (record) => {
    setCurrentItem(record);
    setMode('edit');
    setModalVisible(true);
  };

  /**
   * 查看连接器详情
   * @param {Object} record - 连接器记录
   */
  const handleView = (record) => {
    setCurrentItem(record);
    setMode('view');
    setModalVisible(true);
  };

  /**
   * 删除连接器
   * @param {string} id - 连接器ID
   */
  const handleDelete = async (id) => {
    const res = await deleteConnector(id);
    
    if (res && res.code === '200') {
      message.success('删除成功');
      // 刷新列表
      loadData();
    } else {
      message.error(res?.message || '删除失败');
    }
  };

  /**
   * 弹窗关闭/操作成功回调
   */
  const handleSuccess = () => {
    setModalVisible(false);
    setCurrentItem(null);
    // 刷新列表
    loadData();
  };

  /**
   * 关闭弹窗
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentItem(null);
  };

  /**
   * 副作用
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * 获取表格列配置
   */
  const columns = getConnectorColumns({
    handleView,
    handleEdit,
    handleDelete,
  });

  /**
   * 渲染
   */
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 左侧导航栏 */}
      <SimpleSidebar />
      
      {/* 主内容区 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div className="connector-management-page">
          {/* 页面头部 */}
          <div className="page-header">
            <div className="page-header-left">
              <h4 className="page-title">{pageInfo.title}</h4>
              <span className="page-desc">{pageInfo.description}</span>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {pageInfo.addButtonText}
            </Button>
          </div>

          {/* 搜索工具栏 */}
          <AdminTableToolbar
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearch}
            placeholder={searchConfig.placeholder}
          />

          {/* 表格列表 */}
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
            scroll={{ x: 1200 }}
          />

          {/* 编辑弹窗 */}
          <ConnectorModal
            visible={modalVisible}
            data={currentItem}
            mode={mode}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectorList;
