/**
 * Admin模块 - 审批中心页面路由配置
 * 路由路径: /admin/approvals
 */
export default {
    path: '/admin/approvals',
    auth: false,
    preload: false,
    isStatic: true,
    key: 'admin-approvals',
    component: () => import('./index'),
}
