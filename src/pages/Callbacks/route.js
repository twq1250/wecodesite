/**
 * 回调配置页面路由配置
 * 路由路径: /callbacks
 * 使用内部布局（layout: 'inner'）
 */
export default {
    path: '/callbacks',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'callbacks',
    layout: 'inner',
    component: () => import('./index'),
}
