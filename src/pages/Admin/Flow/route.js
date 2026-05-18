/**
 * 连接流管理模块路由配置
 */
export default {
  path: '/admin/flows',
  auth: false,
  preload: false,
  isStatic: true,
  key: 'admin-flows',
  component: () => import('./index'),
};
