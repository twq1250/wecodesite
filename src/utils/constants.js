export const useTrueFetch = true;

export const API_BASE_URL = '';

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const INIT_PAGECONFIG = {
  pageSize: 10,
  curPage: 1,
  total: 0,
}

export const INIT_PAGINATION = {
  pageSize: 10,
  curPage: 1,
  total: 0,
}

export const PAGE_CONFIGS = {
  apiManagement: {
    ...INIT_PAGECONFIG,
    title: 'API管理',
    key: 'apiManagement',
  },
  callbacks: {
    ...INIT_PAGECONFIG,
    title: '回调配置',
    key: 'callbacks',
  },
  events: {
    ...INIT_PAGECONFIG,
    title: '事件配置',
    key: 'events',
  },
  adminApi: {
    ...INIT_PAGECONFIG,
    title: 'API管理',
    key: 'adminApi',
  },
  adminCallback: {
    ...INIT_PAGECONFIG,
    title: '回调管理',
    key: 'adminCallback',
  },
  adminEvent: {
    ...INIT_PAGECONFIG,
    title: '事件管理',
    key: 'adminEvent',
  },
};

export const SUBSCRIPTION_STATUS = {
  0: { text: '审核中', color: 'orange' },
  1: { text: '已审核', color: 'green' },
  2: { text: '已中止', color: 'red' }
};

export const RESOURCE_STATUS = {
  0: { text: '草稿', color: 'default' },
  1: { text: '待审', color: 'orange' },
  2: { text: '已发布', color: 'green' },
  3: { text: '已下线', color: 'red' }
};

export const EVENT_CHANNEL_TYPE = {
  0: 'MQS',
  1: 'WebHook'
};

export const CALLBACK_CHANNEL_TYPE = {
  0: 'WebHook',
  1: 'SSE',
  2: 'WebSocket'
};

export const AUTH_TYPE = {
  0: 'SOA',
  1: 'APIG'
};

export const formatCategoryPath = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.categoryPath?.join(' > ') || category.nameCn || '';
};

export const getPermissionName = (permission) => {
  if (!permission) return '-';
  if (typeof permission === 'string') return permission;
  return permission.nameCn || permission.scope || '-';
};