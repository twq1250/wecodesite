/**
 * ========================================
 * 连接器管理 - API调用函数
 * ========================================
 * 
 * 提供连接器的所有CRUD操作API调用
 * 遵循统一的响应格式：{ code, message, data, page }
 */

import { API_CONFIG, buildApiUrl, fetchApi } from '../../../configs/web.config';
import {
  mockFetchConnectorList,
  mockFetchConnectorDetail,
  mockCreateConnector,
  mockUpdateConnector,
  mockDeleteConnector,
  mockFetchConnectorTriggers,
  mockCreateTrigger,
  mockUpdateTrigger,
  mockDeleteTrigger,
  mockFetchConnectorActions,
  mockCreateAction,
  mockUpdateAction,
  mockDeleteAction
} from './mock';

/**
 * 获取连接器列表
 * 
 * @param {Object} params - 查询参数
 * @param {string} [params.keyword] - 搜索关键词（匹配名称或描述）
 * @param {number} [params.curPage=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {number} [params.status] - 状态筛选（0-禁用，1-启用）
 * 
 * @returns {Promise<Object>} 
 */
export const fetchConnectorList = async (params = {}) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(API_CONFIG.CONNECTORS.LIST, { 
    //   method: 'GET', 
    //   params 
    // });
    const result = await mockFetchConnectorList(params);
    return result || {};
  } catch (err) {
    console.error('获取连接器列表失败', err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 获取连接器详情
 * 
 * @param {string} id - 连接器ID
 * @returns {Promise<Object>}
 */
export const fetchConnectorDetail = async (id) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(buildApiUrl(API_CONFIG.CONNECTORS.DETAIL, { id }));
    const result = await mockFetchConnectorDetail(id);
    return result || {};
  } catch (err) {
    console.error(`获取连接器详情失败: ${id}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 创建连接器
 * 
 * @param {Object} data - 连接器配置数据
 * @param {string} data.name - 连接器名称（必填）
 * @param {string} [data.description] - 连接器描述
 * @param {number} [data.status=1] - 状态（0-禁用，1-启用）
 * @param {Array} [data.triggers] - 触发事件列表
 * @param {Array} [data.actions] - 执行动作列表
 * 
 * @returns {Promise<Object>}
 */
export const createConnector = async (data) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(API_CONFIG.CONNECTORS.CREATE, { 
    //   method: 'POST', 
    //   body: JSON.stringify(data) 
    // });
    const result = await mockCreateConnector(data);
    return result || {};
  } catch (err) {
    console.error('创建连接器失败', err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 更新连接器
 * 
 * @param {string} id - 连接器ID
 * @param {Object} data - 更新后的连接器配置数据
 * @returns {Promise<Object>}
 */
export const updateConnector = async (id, data) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(buildApiUrl(API_CONFIG.CONNECTORS.UPDATE, { id }), { 
    //   method: 'PUT', 
    //   body: JSON.stringify(data) 
    // });
    const result = await mockUpdateConnector(id, data);
    return result || {};
  } catch (err) {
    console.error(`更新连接器失败: ${id}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 删除连接器
 * 
 * @param {string} id - 连接器ID
 * @returns {Promise<Object>}
 */
export const deleteConnector = async (id) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(buildApiUrl(API_CONFIG.CONNECTORS.DELETE, { id }), { 
    //   method: 'DELETE' 
    // });
    const result = await mockDeleteConnector(id);
    return result || {};
  } catch (err) {
    console.error(`删除连接器失败: ${id}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 获取连接器的触发事件列表
 * 
 * @param {string} connectorId - 连接器ID
 * @returns {Promise<Object>}
 */
export const fetchConnectorTriggers = async (connectorId) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.TRIGGERS, { id: connectorId })
    // );
    const result = await mockFetchConnectorTriggers(connectorId);
    return result || {};
  } catch (err) {
    console.error(`获取触发事件列表失败: ${connectorId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 添加触发事件
 * 
 * @param {string} connectorId - 连接器ID
 * @param {Object} data - 触发事件数据
 * @returns {Promise<Object>}
 */
export const createTrigger = async (connectorId, data) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.TRIGGERS, { id: connectorId }),
    //   { method: 'POST', body: JSON.stringify(data) }
    // );
    const result = await mockCreateTrigger(connectorId, data);
    return result || {};
  } catch (err) {
    console.error(`添加触发事件失败: ${connectorId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 更新触发事件
 * 
 * @param {Object} params - 更新参数
 * @param {string} params.connectorId - 连接器ID
 * @param {string} params.triggerId - 触发事件ID
 * @param {Object} params.data - 更新后的触发事件数据
 * @returns {Promise<Object>}
 */
export const updateTrigger = async (params) => {
  const { connectorId, triggerId, data } = params;
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.TRIGGER_DETAIL, { id: connectorId, triggerId }),
    //   { method: 'PUT', body: JSON.stringify(data) }
    // );
    const result = await mockUpdateTrigger(params);
    return result || {};
  } catch (err) {
    console.error(`更新触发事件失败: ${connectorId}/${triggerId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 删除触发事件
 * 
 * @param {Object} params - 删除参数
 * @param {string} params.connectorId - 连接器ID
 * @param {string} params.triggerId - 触发事件ID
 * @returns {Promise<Object>}
 */
export const deleteTrigger = async (params) => {
  const { connectorId, triggerId } = params;
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.TRIGGER_DETAIL, { id: connectorId, triggerId }),
    //   { method: 'DELETE' }
    // );
    const result = await mockDeleteTrigger(params);
    return result || {};
  } catch (err) {
    console.error(`删除触发事件失败: ${connectorId}/${triggerId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 获取连接器的执行动作列表
 * 
 * @param {string} connectorId - 连接器ID
 * @returns {Promise<Object>}
 */
export const fetchConnectorActions = async (connectorId) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.ACTIONS, { id: connectorId })
    // );
    const result = await mockFetchConnectorActions(connectorId);
    return result || {};
  } catch (err) {
    console.error(`获取执行动作列表失败: ${connectorId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 添加执行动作
 * 
 * @param {string} connectorId - 连接器ID
 * @param {Object} data - 执行动作数据
 * @returns {Promise<Object>}
 */
export const createAction = async (connectorId, data) => {
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.ACTIONS, { id: connectorId }),
    //   { method: 'POST', body: JSON.stringify(data) }
    // );
    const result = await mockCreateAction(connectorId, data);
    return result || {};
  } catch (err) {
    console.error(`添加执行动作失败: ${connectorId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 更新执行动作
 * 
 * @param {Object} params - 更新参数
 * @param {string} params.connectorId - 连接器ID
 * @param {string} params.actionId - 执行动作ID
 * @param {Object} params.data - 更新后的执行动作数据
 * @returns {Promise<Object>}
 */
export const updateAction = async (params) => {
  const { connectorId, actionId, data } = params;
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.ACTION_DETAIL, { id: connectorId, actionId }),
    //   { method: 'PUT', body: JSON.stringify(data) }
    // );
    const result = await mockUpdateAction(params);
    return result || {};
  } catch (err) {
    console.error(`更新执行动作失败: ${connectorId}/${actionId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};

/**
 * 删除执行动作
 * 
 * @param {Object} params - 删除参数
 * @param {string} params.connectorId - 连接器ID
 * @param {string} params.actionId - 执行动作ID
 * @returns {Promise<Object>}
 */
export const deleteAction = async (params) => {
  const { connectorId, actionId } = params;
  try {
    // TODO: 临时使用Mock数据，后续需替换为真实API调用
    // const result = await fetchApi(
    //   buildApiUrl(API_CONFIG.CONNECTORS.ACTION_DETAIL, { id: connectorId, actionId }),
    //   { method: 'DELETE' }
    // );
    const result = await mockDeleteAction(params);
    return result || {};
  } catch (err) {
    console.error(`删除执行动作失败: ${connectorId}/${actionId}`, err);
    return { code: '500', message: '网络错误，请稍后重试' };
  }
};
