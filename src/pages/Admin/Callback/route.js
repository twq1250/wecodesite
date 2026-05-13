/**
 * Admin模块 - 回调管理页面路由配置
 * 路由路径: /admin/callbacks
 */
export default {
    path: '/admin/callbacks',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'admin-callbacks',
    component: () => import('./index'),
}
