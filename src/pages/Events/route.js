/**
 * 事件配置页面路由配置
 * 路由路径: /events
 * 使用内部布局（layout: 'inner'）
 */
export default {
    path: '/events',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'events',
    layout: 'inner',
    component: () => import('./index'),
}
