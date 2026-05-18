/**
 * 连接器管理模块路由配置
 */
export default {
  path: '/admin/connectors',
  auth: false,
  preload: false,
  isStatic: true,
  key: 'admin-connectors',
  component: () => import('./index'),
};
