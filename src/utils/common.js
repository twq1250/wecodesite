import { getUserIdCookie } from './cookie';

export const queryParams = param => {
    const reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    const r = 
        window.location.search.substr(1).match(reg) || 
        window.location.hash
            .substring(window.location.hash.search(/\?/) + 1)
            .match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    }
    return '';
}

export const openUrl = url => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
}

export const ADMIN_WHITELIST = [
  'admin001',
  'admin002',
  'perm_admin',
];

export const isInAdminWhitelist = () => {
  const currentUserId = getUserIdCookie();
  return ADMIN_WHITELIST.includes(currentUserId);
};

export const convertToTreeData = (categoryList) => {
  if (!Array.isArray(categoryList)) return [];
  return categoryList.map(cat => ({
    value: cat.id,
    title: cat.nameCn,
    key: cat.id,
    children: convertToTreeData(cat.children)
  }));
};

// ==================== 通用组件工具函数 ====================

// 根据页面类型获取类名前缀
export const getPageClassPrefix = (pageType) => {
  const prefixMap = {
    'api': 'api-management',
    'callback': 'callbacks',
    'event': 'events'
  };
  return prefixMap[pageType] || 'resource';
};

// 根据页面类型获取标题
export const getPageTitle = (pageType) => {
  const titleMap = {
    'api': 'API管理',
    'callback': '回调配置',
    'event': '事件配置'
  };
  return titleMap[pageType] || '';
};

// 分类数据转换为模块列表格式
export const transformCategoriesToModules = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) return [];

  const result = [];
  const firstCategoryId = categories[0]?.id;
  if (firstCategoryId) {
    result.push({
      key: 'all',
      value: firstCategoryId,
      name: '全部分类'
    });
  }

  categories.forEach(cat => {
    if (cat.children && Array.isArray(cat.children)) {
      cat.children.forEach(child => {
        if (child.id) {
          result.push({
            key: child.id,
            value: child.id,
            name: child.nameCn || child.name
          });
        }
      });
    }
  });

  return result;
};

// 解析Tab配置
export const parseTabConfig = (rawData, targetAppType, searchKey) => {
  try {
    if (!rawData?.data?.lookups?.[searchKey]?.items) {
      return { firstLevelTabs: [], secondLevelTabs: [] };
    }
    
    const items = rawData.data.lookups[searchKey].items;
    const targetItem = items.find(item => item.itemCode === targetAppType);
    
    if (!targetItem?.itemValue) {
      return { firstLevelTabs: [], secondLevelTabs: [] };
    }
    
    const parsedTabs = JSON.parse(targetItem.itemValue);
    return {
      firstLevelTabs: parsedTabs,
      secondLevelTabs: parsedTabs[0]?.children || []
    };
  } catch (error) {
    return { firstLevelTabs: [], secondLevelTabs: [] };
  }
};