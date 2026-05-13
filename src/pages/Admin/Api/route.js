/**
 * Admin模块 - API管理页面路由配置
 * 路由路径: /admin/apis
 */
export default {
    path: '/admin/apis',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'admin-apis',
    component: () => import('./index'),
}
