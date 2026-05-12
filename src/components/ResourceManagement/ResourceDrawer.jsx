import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tabs, Table, Button, Pagination, Input, Select, message } from 'antd';
const { TabPane } = Tabs;
import { PAGE_SIZE_OPTIONS, INIT_PAGECONFIG, DRAWER_WIDTH } from '../../utils/constants';
import { NEED_REVIEW_OPTIONS } from '../../utils/commonTableConfigs';
import { openUrl, transformCategoriesToModules, parseTabConfig } from '../../utils/common';
import './ResourceDrawer.less';

/**
 * 通用资源抽屉组件
 * 
 * 功能：
 * - 支持简单模式和高级模式（showAdvancedFeatures）
 * - 高级模式：两层Tabs + 模块分类侧边栏
 * - 简单模式：无Tabs和模块分类
 * 
 * @param {boolean} open - 抽屉显示状态
 * @param {Function} onClose - 关闭抽屉回调
 * @param {Function} onConfirm - 确认回调
 * @param {string} title - 抽屉标题
 * @param {string} className - 自定义类名
 * @param {string} appId - 应用ID
 * @param {Array} selectedItems - 已选择的资源列表
 * @param {boolean} subscribeLoading - 订阅加载状态
 * @param {string} placeholder - 搜索框占位符
 * @param {Function} fetchCategories - 获取分类列表的方法
 * @param {Function} fetchData - 获取数据列表的方法
 * @param {Function} getColumns - 获取表格列配置的方法
 * @param {boolean} showAdvancedFeatures - 是否显示高级功能（API管理=true，回调/事件=false）
 * @param {Object} advancedConfig - 高级功能配置
 */
function ResourceDrawer({
  open,
  onClose,
  onConfirm,
  title = '添加资源',
  className = 'resource-drawer',
  appId,
  selectedItems = [],
  subscribeLoading = false,
  placeholder = '资源名称/标识',
  fetchCategories,
  fetchData,
  getColumns,
  showAdvancedFeatures = false,
  advancedConfig = {},
}) {
  // ==================== 状态定义 ====================
  // Tab配置状态
  const [tabConfig, setTabConfig] = useState({ firstLevelTabs: [], secondLevelTabs: [] });
  // 当前选中的身份类型
  const [activeIdentityType, setActiveIdentityType] = useState('');
  // 当前选中的API类型
  const [activeApiType, setActiveApiType] = useState('');
  // 当前选中的模块（侧边栏分类）
  const [activeModule, setActiveModule] = useState('all');
  // 表格选中行的key数组
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 分页配置对象
  const [pagination, setPagination] = useState(INIT_PAGECONFIG);
  // 数据列表
  const [data, setData] = useState([]);
  // 模块列表数据（侧边栏）
  const [modulesData, setModulesData] = useState([]);
  // 数据加载状态
  const [loading, setLoading] = useState(false);
  // 搜索关键词
  const [filterKeyword, setFilterKeyword] = useState('');
  // 是否需要审核筛选条件
  const [filterNeedReview, setFilterNeedReview] = useState('all');

  // ==================== 加载Tab配置 ====================
  const loadTabConfig = async () => {
    if (!advancedConfig.fetchTabConfig) return null;
    
    setLoading(true);
    try {
      const rawData = await advancedConfig.fetchTabConfig(advancedConfig.tabSearchKey);
      
      if (rawData && rawData.code === 200) {
        // 根据 appId 获取应用信息，判断是业务应用还是个人应用
        const appInfo = advancedConfig.mockAppInfo?.[appId];
        const appType = appInfo && appInfo.eamap ? 'business' : 'person';
        
        // 数据处理：根据应用类型筛选并解析数据
        const parsedConfig = parseTabConfig(rawData, appType, advancedConfig.tabSearchKey);
        
        setTabConfig({
          firstLevelTabs: parsedConfig.firstLevelTabs,
          secondLevelTabs: parsedConfig.secondLevelTabs
        });
        
        // 设置默认选中的Tab
        const firstTab = parsedConfig.firstLevelTabs[0];
        const firstChildTab = firstTab?.children?.[0];
        
        setActiveIdentityType(firstTab?.key || '');
        setActiveApiType(firstChildTab?.key || '');
        
        return { firstTab, firstChildTab };
      } else {
        message.error(rawData?.message || '加载Tab配置失败');
        setTabConfig({ firstLevelTabs: [], secondLevelTabs: [] });
        return null;
      }
    } catch (error) {
      message.error('加载Tab配置失败');
      setTabConfig({ firstLevelTabs: [], secondLevelTabs: [] });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==================== 加载模块列表 ====================
  const loadModules = async (apiType) => {
    setLoading(true);
    const categoriesRes = await fetchCategories(apiType);
    if (categoriesRes && categoriesRes.code === '200') {
      const transformedModules = advancedConfig.transformModules 
        ? advancedConfig.transformModules(categoriesRes.data || [])
        : transformCategoriesToModules(categoriesRes.data || []);
      setModulesData(transformedModules);
      return transformedModules;
    } else {
      message.error(categoriesRes?.message || '加载分类失败');
      setModulesData([]);
      return [];
    }
  };

  // ==================== 加载数据列表 ====================
  const loadData = async (params = {}, modules = null, activeModuleKey = null) => {
    setLoading(true);
    let currentCategoryId;
    
    if (showAdvancedFeatures) {
      // 高级模式：需要根据模块选择来获取 categoryId
      const targetModules = modules || modulesData;
      const currentModule = activeModuleKey !== null ? activeModuleKey : activeModule;
      
      if (currentModule === 'all') {
        currentCategoryId = targetModules[0]?.value || ''
      } else {
        const selectModule = targetModules.find(module => module.key === currentModule);
        currentCategoryId = selectModule?.value || ''
      }

      if (!currentCategoryId) {
        setLoading(false);
        return;
      }
    } else {
      // 简单模式：优先使用传入的 categoryId，否则使用默认值
      currentCategoryId = params.categoryId || modulesData[0]?.value || '';
      if (!currentCategoryId) {
        setLoading(false);
        return;
      }
    }
    
    const defaultParams = {
      // 高级模式下需要的参数
      ...(showAdvancedFeatures && {
        identityType: activeIdentityType,
        apiType: activeApiType,
      }),
      // 统一使用计算后的 categoryId
      categoryId: currentCategoryId,
      keyword: filterKeyword,
      needReview: filterNeedReview,
      curPage: pagination.curPage,
      pageSize: pagination.pageSize,
      appId: appId,
      ...params
    };
    
    const result = await fetchData(defaultParams);
    if (result && result.code === '200') {
      const resultData = result.data || [];
      const resultTotal = result.total || resultData.length;
      setData(resultData);
      setPagination(prev => ({ ...prev, total: resultTotal }));
    } else if (Array.isArray(result?.data)) {
      setData(result.data);
      setPagination(prev => ({ ...prev, total: result.total || result.data.length }));
    } else {
      message.error(result?.message || result?.messageZh || '加载列表失败');
      setData([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    }
    setLoading(false);
  };

  // ==================== 抽屉打开时初始化 ====================
  useEffect(() => {
    if (!open) return;
    
    // 重置状态
    setActiveModule('all');
    setFilterKeyword('');
    setFilterNeedReview('all');
    setPagination(INIT_PAGECONFIG);
    setSelectedRowKeys(selectedItems.map(item => item.id));
    
    const initData = async () => {
      if (showAdvancedFeatures) {
        // 高级模式：加载Tab配置
        const tabResult = await loadTabConfig();
        
        if (!tabResult) {
          return;
        }
        
        // 加载模块列表
        const modules = await loadModules(tabResult.firstChildTab.key);
        
        // 加载数据列表
        await loadData({ needReview: 'all', keyword: '' }, modules, 'all');
      } else {
        // 简单模式：直接加载分类和数据
        const categoriesRes = await fetchCategories();
        if (categoriesRes && categoriesRes.code === '200') {
          const rootId = categoriesRes.data?.[0]?.id;
          if (rootId) {
            setModulesData([{ key: 'all', value: rootId, name: '全部分类' }]);
            await loadData({ categoryId: rootId, needReview: 'all', keyword: '' }, [{ key: 'all', value: rootId }], 'all');
          }
        } else {
          message.error(categoriesRes?.message || '加载分类失败');
        }
      }
    };
    
    initData();
  }, [open, selectedItems]);

  // ==================== 事件处理 ====================
  
  // 处理模块点击
  const handleModuleClick = async (module) => {
    setActiveModule(module.key);
    setPagination(INIT_PAGECONFIG);
    setSelectedRowKeys([]);
    await loadData({ curPage: 1 }, null, module.key);
  };

  // 处理身份类型Tab切换
  const handleIdentityChange = async (identityType) => {
    const currentFirstTab = tabConfig.firstLevelTabs.find(tab => tab.key === identityType);
    const newSecondLevelTabs = currentFirstTab?.children || [];
    const defaultSecondLevel = newSecondLevelTabs[0]?.key || '';
    
    setActiveIdentityType(identityType);
    setActiveApiType(defaultSecondLevel);
    setActiveModule('all');
    setFilterKeyword('');
    setFilterNeedReview('all');
    setPagination(INIT_PAGECONFIG);
    setSelectedRowKeys([]);
    
    if (defaultSecondLevel) {
      const modules = await loadModules(defaultSecondLevel);
      await loadData({
        identityType,
        apiType: defaultSecondLevel,
        keyword: '',
        needReview: 'all',
        curPage: 1,
        categoryId: modules[0]?.value
      }, modules, 'all');
    }
  };

  // 处理API类型Tab切换
  const handleApiTypeChange = async (type) => {
    setActiveApiType(type);
    setActiveModule('all');
    setFilterKeyword('');
    setFilterNeedReview('all');
    setPagination(INIT_PAGECONFIG);
    setSelectedRowKeys([]);
    
    const modules = await loadModules(type);
    await loadData({
      identityType: activeIdentityType,
      apiType: type,
      keyword: '',
      needReview: 'all',
      curPage: 1,
      categoryId: modules[0]?.value
    }, modules, 'all');
  };

  // 处理分页变化
  const handlePageChange = async (page, newPageSize) => {
    const newPagination = {
      ...pagination,
      curPage: page,
      ...(newPageSize && newPageSize !== pagination.pageSize ? { pageSize: newPageSize } : {})
    };
    setPagination(newPagination);
    await loadData({ 
      curPage: page, 
      pageSize: newPageSize || pagination.pageSize 
    }, null, activeModule);
  };

  // 处理表格选中行变化
  const handleSelectChange = (keys) => {
    setSelectedRowKeys(keys);
  };

  // 处理确认
  const handleConfirm = () => {
    const selected = data.filter(item => selectedRowKeys.includes(item.id));
    onConfirm(selected);
    setSelectedRowKeys([]);
    setPagination(INIT_PAGECONFIG);
    onClose();
  };

  // 处理关键词输入变化
  const handleFilterChange = async (e) => {
    const keyword = e.target.value;
    setFilterKeyword(keyword);
    setPagination(INIT_PAGECONFIG);
    await loadData({ keyword, curPage: 1 }, null, activeModule);
  };

  // 处理是否需要审核筛选变化
  const handleNeedReviewChange = async (value) => {
    setFilterNeedReview(value);
    setPagination(INIT_PAGECONFIG);
    await loadData({ needReview: value, curPage: 1 }, null, activeModule);
  };

  // 处理打开文档
  const handleOpenDoc = (docUrl) => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

  const columns = getColumns();

  // 表格行选择器配置
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.isSubscribed !== 99,
    }),
  };

  // ==================== 条件渲染 ====================
  
  // 渲染第一层Tabs（仅 showAdvancedFeatures=true 时显示）
  const renderFirstLevelTabs = useCallback(() => {
    if (!showAdvancedFeatures) return null;
    
    const tabs = tabConfig.firstLevelTabs;
    if (!tabs || tabs.length <= 0) return null;
    
    return (
      <Tabs
        activeKey={activeIdentityType}
        onChange={handleIdentityChange}
      >
        {tabs.map(tab => (
          <TabPane key={tab.key} tab={tab.label} />
        ))}
      </Tabs>
    );
  }, [showAdvancedFeatures, tabConfig, activeIdentityType]);
  
  // 渲染第二层Tabs（仅 showAdvancedFeatures=true 时显示）
  const renderSecondLevelTabs = useCallback(() => {
    if (!showAdvancedFeatures) return null;
    
    const firstLevelTab = tabConfig.firstLevelTabs.find(tab => tab.key === activeIdentityType);
    const apiTabs = firstLevelTab?.children || [];
    
    if (apiTabs.length === 0) return null;
    
    return (
      <Tabs
        activeKey={activeApiType}
        onChange={handleApiTypeChange}
      >
        {apiTabs.map(tab => (
          <TabPane key={tab.key} tab={tab.label} />
        ))}
      </Tabs>
    );
  }, [showAdvancedFeatures, tabConfig, activeIdentityType, activeApiType]);
  
  // 渲染模块侧边栏（仅 showAdvancedFeatures=true 时显示）
  const renderModuleSidebar = useCallback(() => {
    if (!showAdvancedFeatures) return null;
    
    return (
      <div className="drawer-sidebar">
        <ul className="module-list">
          {modulesData.map(module => (
            <li
              key={module.key}
              className={`module-item ${activeModule === module.key ? 'active' : ''}`}
              onClick={() => handleModuleClick(module)}
            >
              {module.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [showAdvancedFeatures, modulesData, activeModule]);

  // ==================== 主渲染 ====================
  return (
    <Drawer
      title={title}
      placement="right"
      width={DRAWER_WIDTH}
      onClose={onClose}
      open={open}
      className={`resource-drawer ${className || ''}`}
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
      <div className="drawer-content">
        {/* 第一层Tabs - 条件渲染 */}
        {renderFirstLevelTabs()}
        
        {/* 第二层Tabs - 条件渲染 */}
        {renderSecondLevelTabs()}
        
        {/* 筛选区域 - 始终显示 */}
        <div className="drawer-filter">
          <Input
            placeholder={placeholder}
            value={filterKeyword}
            onChange={handleFilterChange}
            style={{ width: 200 }}
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
        
        {/* 主内容区域 - 差异化布局 */}
        <div className="drawer-main">
          {/* 模块侧边栏 - 条件渲染 */}
          {renderModuleSidebar()}
          
          {/* 表格区域 - 始终显示 */}
          <div className={showAdvancedFeatures ? "drawer-table" : "drawer-table-full"}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
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
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default ResourceDrawer;
