/**
 * ========================================
 * 连接流管理 - 列表页面主组件
 * ========================================
 * 
 * 功能：
 * - 展示连接流列表（分页、搜索、类型筛选）
 * - 创建新的连接流
 * - 编辑已有连接流
 * - 删除连接流
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchFlowList, deleteFlow } from './thunk';
import AdminTableToolbar from '../../../components/AdminTableToolbar/AdminTableToolbar';
import PageList from '../../../components/PageList/PageList';
import SimpleSidebar from '../../../components/SimpleSidebar/SimpleSidebar';
import { pageInfo, flowSearchConfig, getFlowColumns } from './constants';
import { INIT_PAGECONFIG } from '../../../utils/constants';
import './Flow.m.less';

/**
 * 连接流列表页面主组件
 */
function FlowList() {
  const navigate = useNavigate();
  
  /**
   * State定义
   */
  
  // 连接流列表数据
  const [data, setData] = useState([]);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 分页配置
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  
  // 流程类型筛选
  const [flowType, setFlowType] = useState(undefined);

  /**
   * 数据加载
   * @param {Object} params - 请求参数
   */
  const loadData = async (params = {}) => {
    setLoading(true);
    
    // 合并参数
    const finalParams = {
      keyword: params.keyword ?? keyword,
      type: params.type ?? flowType,
      curPage: params.curPage ?? pagination.curPage,
      pageSize: params.pageSize ?? pagination.pageSize,
    };

    // 调用API
    const result = await fetchFlowList(finalParams);
    
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
   * 类型筛选变化处理
   * @param {string} value - 流程类型
   */
  const handleTypeChange = (value) => {
    setFlowType(value);
    loadData({ type: value, curPage: 1 });
  };

  /**
   * 新建连接流
   */
  const handleAdd = () => {
    navigate('/admin/flows/new');
  };

  /**
   * 编辑连接流
   * @param {Object} record - 连接流记录
   */
  const handleEdit = (record) => {
    navigate(`/admin/flows/${record.id}/edit`);
  };

  /**
   * 删除连接流
   * @param {string} id - 连接流ID
   */
  const handleDelete = async (id) => {
    const res = await deleteFlow(id);
    
    if (res && res.code === '200') {
      message.success('删除成功');
      // 刷新列表
      loadData();
    } else {
      message.error(res?.message || '删除失败');
    }
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
  const columns = getFlowColumns({
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
        <div className="flow-management-page">
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
            onKeywordChange={setKeyword}
            onSearch={handleSearch}
            placeholder={flowSearchConfig.placeholder}
            type={flowType}
            onTypeChange={handleTypeChange}
            showTypeFilter
            typeOptions={[
              { value: undefined, label: '全部类型' },
              { value: 'business', label: '业务流' },
              { value: 'schedule', label: '定时流' },
              { value: 'subflow', label: '子流程' },
            ]}
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
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </div>
  );
}

export default FlowList;
