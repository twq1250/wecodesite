/**
 * API管理页面路由配置
 * 路由路径: /api-management
 * 使用内部布局（layout: 'inner'）
 */
export default {
    path: '/api-management',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'api-management',
    layout: 'inner',
    component: () => import('./index'),
}
