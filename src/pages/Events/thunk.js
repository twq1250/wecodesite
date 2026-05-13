/**
 * 事件配置模块 - 事件相关接口调用
 * 用于应用订阅事件、管理已订阅的事件
 */
import { API_CONFIG, buildApiUrl, fetchApi } from '../../configs/web.config';

/**
 * 事件分类别名常量
 */
export const EVENT_CATEGORY_ALIAS = 'event';

/**
 * 获取事件分类列表
 * @returns {Promise<Object>} 包含 code、messageZh、data 的响应对象
 */
export const fetchEventCategories = async () => {
  try {
    const result = await fetchApi(API_CONFIG.CATEGORIES.LIST, { params: { categoryAlias: EVENT_CATEGORY_ALIAS } });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 根据筛选条件获取事件列表（用于事件选择器）
 * @param {Object} params - 筛选参数，包含 keyword、needReview、categoryId、curPage、pageSize、appId
 * @returns {Promise<Object>} 筛选后的事件列表
 */
export const fetchEvents = async ({ keyword, needReview, categoryId, curPage, pageSize, appId }) => {
  const queryParams = {};
  if (keyword) queryParams.keyword = keyword;
  if (needReview !== undefined && needReview !== 'all') {
    queryParams.needApproval = needReview === 'true' ? 1 : 0;
  }
  if (curPage) queryParams.curPage = curPage;
  if (pageSize) queryParams.pageSize = pageSize;
  if (appId) queryParams.appId = appId;
  queryParams.includeChildren = true;
  
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.CATEGORIES.EVENTS, { id: categoryId }), { params: queryParams });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 获取应用已订阅的事件列表（带分页）
 * @param {string} appId - 应用ID
 * @param {Object} params - 查询参数，包含 status、keyword、curPage、pageSize 等
 * @returns {Promise<Object>} 包含 code、messageZh、data、page 的响应对象
 */
export const fetchAppEvents = async (appId, params = {}) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_EVENTS.LIST, { appId }), { params });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 订阅事件权限
 * @param {string} appId - 应用ID
 * @param {Object} params - 订阅参数，包含 permissionIds 等
 * @returns {Promise<Object>} 订阅结果
 */
export const subscribeEvents = async (appId, params) => {
  const subscribeParams = {
    ...params,
    channelType: 0
  };
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_EVENTS.SUBSCRIBE, { appId }), { method: 'POST', body: JSON.stringify(subscribeParams) });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 配置事件订阅参数
 * @param {string} appId - 应用ID
 * @param {string} eventId - 事件ID
 * @param {Object} params - 配置参数
 * @returns {Promise<Object>} 配置结果
 */
export const configEventSubscription = async (appId, eventId, params) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_EVENTS.CONFIG, { appId, id: eventId }), { method: 'PUT', body: JSON.stringify(params) });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 删除事件定义
 * @param {string} id - 事件ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteEvent = async (id) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.EVENTS.DELETE, { id }), { method: 'DELETE' });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 删除应用事件订阅
 * @param {string} appId - 应用ID
 * @param {string} subscriptionId - 订阅记录ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteAppEventSubscription = async (appId, subscriptionId) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_EVENTS.DELETE, { appId, id: subscriptionId }), { method: 'DELETE' });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 撤回事件申请
 * @param {string} appId - 应用ID
 * @param {string} id - 订阅记录ID
 * @returns {Promise<Object>} 撤回结果
 */
export const withdrawApproval = async (appId, id) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_EVENTS.WITHDRAW, { appId, id }), { method: 'POST' });
    return result || {};
  } catch (err) {
    return {};
  }
};
