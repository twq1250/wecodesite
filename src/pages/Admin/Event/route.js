/**
 * Admin模块 - 事件管理页面路由配置
 * 路由路径: /admin/events
 */
export default {
    path: '/admin/events',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'admin-events',
    component: () => import('./index'),
}
