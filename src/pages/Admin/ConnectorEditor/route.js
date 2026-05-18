/**
 * 连接器编辑页路由配置
 */
export default {
  path: '/admin/connector-editor',
  auth: false,
  preload: false,
  isStatic: true,
  key: 'admin-connector-editor',
  component: () => import('./index'),
};
