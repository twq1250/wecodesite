/**
 * 回调配置模块 - 回调相关接口调用
 * 用于应用订阅回调、管理已订阅的回调
 */
import { API_CONFIG, buildApiUrl, fetchApi } from '../../configs/web.config';

/**
 * 回调分类别名常量
 */
export const CALLBACK_CATEGORY_ALIAS = 'callback';

/**
 * 获取回调分类列表
 * @returns {Promise<Object>} 包含 code、messageZh、data 的响应对象
 */
export const fetchCallbackCategories = async () => {
  try {
    const result = await fetchApi(API_CONFIG.CATEGORIES.LIST, { params: { categoryAlias: CALLBACK_CATEGORY_ALIAS } });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 根据筛选条件获取回调列表（用于回调选择器）
 * @param {Object} params - 筛选参数，包含 keyword、needReview、categoryId、curPage、pageSize、appId
 * @returns {Promise<Object>} 筛选后的回调列表
 */
export const fetchCallbacks = async ({ keyword, needReview, categoryId, curPage, pageSize, appId }) => {
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
    const result = await fetchApi(buildApiUrl(API_CONFIG.CATEGORIES.CALLBACKS, { id: categoryId }), { params: queryParams });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 获取应用已订阅的回调列表（带分页）
 * @param {string} appId - 应用ID
 * @param {Object} params - 查询参数，包含 status、keyword、curPage、pageSize 等
 * @returns {Promise<Object>} 包含 code、messageZh、data、page 的响应对象
 */
export const fetchAppCallbacks = async (appId, params = {}) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_CALLBACKS.LIST, { appId }), { params });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 订阅回调权限
 * @param {string} appId - 应用ID
 * @param {Object} params - 订阅参数，包含 permissionIds 等
 * @returns {Promise<Object>} 订阅结果
 */
export const subscribeCallbacks = async (appId, params) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_CALLBACKS.SUBSCRIBE, { appId }), { method: 'POST', body: JSON.stringify(params) });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 配置回调订阅参数
 * @param {string} appId - 应用ID
 * @param {string} callbackId - 回调ID
 * @param {Object} params - 配置参数
 * @returns {Promise<Object>} 配置结果
 */
export const configCallbackSubscription = async (appId, callbackId, params) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_CALLBACKS.CONFIG, { appId, id: callbackId }), { method: 'PUT', body: JSON.stringify(params) });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 删除回调定义
 * @param {string} id - 回调ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteCallback = async (id) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.CALLBACKS.DELETE, { id }), { method: 'DELETE' });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 删除应用回调订阅
 * @param {string} appId - 应用ID
 * @param {string} subscriptionId - 订阅记录ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteAppCallbackSubscription = async (appId, subscriptionId) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_CALLBACKS.DELETE, { appId, id: subscriptionId }), { method: 'DELETE' });
    return result || {};
  } catch (err) {
    return {};
  }
};

/**
 * 撤回回调申请
 * @param {string} appId - 应用ID
 * @param {string} id - 订阅记录ID
 * @returns {Promise<Object>} 撤回结果
 */
export const withdrawApproval = async (appId, id) => {
  try {
    const result = await fetchApi(buildApiUrl(API_CONFIG.APP_CALLBACKS.WITHDRAW, { appId, id }), { method: 'POST' });
    return result || {};
  } catch (err) {
    return {};
  }
};
