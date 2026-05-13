/**
 * Admin模块 - 分类管理页面路由配置
 * 路由路径: /admin/categories
 */
export default {
    path: '/admin/categories',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'admin-categories',
    component: () => import('./index'),
}
