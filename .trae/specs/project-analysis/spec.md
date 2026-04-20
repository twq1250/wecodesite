# 飞书开放平台开发者控制台项目分析文档

## 1. 项目概述

### 1.1 项目名称
飞书开放平台开发者控制台 (feishu-developer-console)

### 1.2 项目类型
React + Vite 单页应用 (SPA)

### 1.3 核心功能
飞书应用管理后台，用于管理应用的凭证、成员、API权限、事件订阅和版本发布等核心功能。

### 1.4 目标用户
企业开发者、应用管理员

---

## 2. 技术栈

### 2.1 核心框架
- **React**: 18.2.0
- **React Router**: 6.20.0
- **Vite**: 5.0.0

### 2.2 UI 组件库
- **Ant Design (antd)**: 4.24.16
- **@ant-design/icons**: 6.1.1

### 2.3 样式方案
- **Less**: 4.2.0
- **CSS 变量**: 主题管理
- **内联样式**: 部分组件

---

## 3. 项目结构

```
wecodesite/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.jsx + Layout.m.less
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       └── AppInfoBar/
│   │   └── appcard/
│   │       ├── AppCard.jsx + AppCard.m.less
│   ├── pages/
│   │   ├── Applist/         # 应用列表页 (/)
│   │   ├── BasicInfo/       # 凭证和基础信息页 (/basic-info)
│   │   ├── Members/         # 成员管理页 (/members)
│   │   ├── Capabilities/    # 添加应用能力页 (/capabilities)
│   │   ├── CapabilityDetail/ # 能力详情页 (/capability/:id)
│   │   ├── ApiManagement/   # API管理页 (/api-management)
│   │   ├── Events/          # 事件配置页 (/events)
│   │   └── VersionRelease/  # 版本发布页 (/version-release)
│   ├── styles/
│   │   └── global.m.less
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 4. 布局结构

### 4.1 整体布局
```
┌─────────────────────────────────────────────────┐
│     Header (顶部导航)  高度: 64px              │
├─────────────────────────────────────────────────┤
│     AppInfoBar (应用信息栏)  高度: 50px          │
├──────────┬──────────────────────────────────────┤
│  侧边栏   │           主内容区                   │
│  220px   │           (可滚动)                    │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### 4.2 布局规则
- 页面整体不滚动，高度为 100vh
- 仅侧边栏和主内容区能独立滚动
- 主内容区高度 = 窗口高度 - Header高度(64px) - AppInfoBar高度(50px,仅详情页) - 内边距(24px)
- 仅首页不显示侧边栏和应用信息栏，详情页显示

### 4.3 样式变量 (src/styles/global.m.less)
```less
:root {
  --primary-color: #0066ff;
  --primary-hover: #0052cc;
  --primary-light: #e6f0ff;
  --text-primary: #1f1f1f;
  --text-secondary: #5e5e5e;
  --text-tertiary: #8e8e8e;
  --border-color: #e3e3e3;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f7;
  --bg-hover: #f2f2f2;
  --success-color: #0f9d58;
  --warning-color: #f4b400;
  --error-color: #db2828;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --radius-sm: 4px;
  --radius-md: 8px;
  --spacing-base: 16px;
}
```

### 4.4 全局字体
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
font-size: 14px;
```

---

## 5. 组件详解

### 5.1 Header (顶部导航)
**文件**: `src/components/layout/Header/Header.jsx`

**结构**:
- 左侧: Logo (32x32px蓝色菱形图标) + "开放平台"文字 + "开发文档"链接
- 右侧: "开发者"文字

**样式**:
- 高度: 64px (实际代码设置)
- 背景: #fff
- 边框底: 1px solid #f0f0f0
- Logo背景: #0066ff, 圆角6px

### 5.2 Sidebar (侧边栏导航)
**文件**: `src/components/layout/Sidebar/Sidebar.jsx`

**菜单结构**:
```
├── 基础信息
│   ├── 凭证和基础信息 (basic-info)
│   └── 成员管理 (members)
├── 应用能力
│   └── 添加应用能力 (capabilities)
├── 开发配置
│   ├── API管理 (api-management)
│   └── 事件配置 (events)
└── 版本管理
    └── 版本发布 (version-release)
```

**样式**:
- 宽度: 220px (Layout中硬编码), Sidebar.m.less中是200px
- 分类标题: 12px, #8e8e8e, 大写字母, 字间距0.5px
- 菜单项: 10px 12px内边距, 圆角4px
- 激活状态: 背景#e6f0ff, 文字#0066ff

**功能**:
- 路由跳转: `/${key}?appId=${appId}`
- 接收URL参数 `appId` (默认值为 '1')
- 当前路径高亮

### 5.3 AppInfoBar (应用信息栏)
**文件**: `src/components/layout/AppInfoBar/AppInfoBar.jsx`

**数据源 (mock)**:
```javascript
const mockApps = {
  '1': { name: '测试应用', icon: '🔧', status: '已发布', eamap: 'EAMAP-2024-001' },
  '2': { name: '企业服务', icon: '🏢', status: '开发中', eamap: null },
  '3': { name: '审批助手', icon: '📋', status: '已发布', eamap: 'EAMAP-2024-002' },
};
```

**显示**:
- 左侧: 房子图标 (点击返回首页)
- 右侧: 应用名称 + EAMAP绑定状态 ("已绑定：xxx" 或 "未绑定应用服务：立即绑定")

### 5.4 AppCard (应用卡片)
**文件**: `src/components/appcard/AppCard.jsx`

**显示内容**:
- 左侧: 应用图标 (54x54px, 圆角14px)
- 中间: 应用名称 + EAMAP绑定Tag
- 底部: 所有者、角色、最新动态

**交互**: 点击跳转 `/basic-info?appId=${app.id}`

---

## 6. 页面详情

### 6.1 AppList (应用列表页)
**路由**: `/` (首页)

**布局**:
- 页面最大宽度: 960px, 居中
- 标题 "我的应用" + "创建应用"按钮
- 3列网格布局应用卡片

**Mock数据**:
```javascript
export const mockApps = [
  { id: '1', name: '测试应用', icon: '🔧', status: '已发布', eamap: 'EAMAP-2024-001', owner: 'zhangsan@company.com', role: '所有者', updateTime: '2024-01-15 10:30:45' },
  { id: '2', name: '企业服务', icon: '🏢', status: '开发中', eamap: null, owner: 'lisi@company.com', role: '开发者', updateTime: '2024-02-01 14:20:30' },
  { id: '3', name: '审批助手', icon: '📋', status: '已发布', eamap: 'EAMAP-2024-002', owner: 'wangwu@company.com', role: '所有者', updateTime: '2024-01-20 09:15:00' },
];
```

### 6.2 BasicInfo (凭证和基础信息页)
**路由**: `/basic-info?appId=xxx`

**卡片结构**:
1. **应用基本信息**: 应用名称(Input), 应用描述(TextArea,4行)
2. **应用凭证**: App ID (Code显示), App Secret (显示为*************)
3. **安全配置**: 授权回调地址(Input)
4. **保存按钮** (Primary)

**Mock数据**:
```javascript
export const mockAppInfo = {
  '1': { name: '测试应用', icon: '🔧', description: '用于测试的开发应用', appId: 'cli_9a1b2c3d4e5f6', appSecret: '********************************', redirectUrls: 'https://example.com/callback' },
  '2': { name: '企业服务', icon: '🏢', description: '企业内部服务平台', appId: 'cli_7g8h9i0j1k2l', appSecret: '********************************', redirectUrls: 'https://company.com/oauth' },
  '3': { name: '审批助手', icon: '📋', description: '企业审批流程管理', appId: 'cli_3m4n5o6p7q8r', appSecret: '********************************', redirectUrls: 'https://approval.com/callback' },
};
```

### 6.3 Members (成员管理页)
**路由**: `/members?appId=xxx`

**表格列**: 姓名、邮箱、角色(Tag: 管理员蓝色, 开发者默认)、状态(Tag: 正常绿色, 异常红色)、操作(编辑/移除)

**Mock数据**:
```javascript
export const mockMembers = [
  { id: 1, name: '张三', email: 'zhangsan@company.com', role: '管理员', status: '正常' },
  { id: 2, name: '李四', email: 'lisi@company.com', role: '开发者', status: '正常' },
  { id: 3, name: '王五', email: 'wangwu@company.com', role: '开发者', status: '正常' },
];
```

### 6.4 Capabilities (添加应用能力页)
**路由**: `/capabilities?appId=xxx`

**展示**: 卡片列表显示"已启用的应用能力"

**Mock数据**:
```javascript
const allCapabilities = [
  { id: 1, name: '通讯录权限', description: '读取企业通讯录', status: 'enabled' },
  { id: 2, name: '消息推送', description: '向用户发送消息', status: 'disabled' },
  { id: 3, name: '日历管理', description: '管理用户日历', status: 'disabled' },
  { id: 4, name: '云空间', description: '访问云文档', status: 'enabled' },
];
```

**交互**: 点击跳转到 `/capability/${cap.id}?appId=${appId}`

### 6.5 CapabilityDetail (能力详情页)
**路由**: `/capability/:capabilityId?appId=xxx`

**卡片内容**:
1. **基本信息**: 能力名称、能力描述、启用状态(绿色Tag)、添加时间
2. **权限列表**: 带绿色勾选图标的项目列表

**Mock数据**:
```javascript
const capabilityDetails = {
  1: { name: '通讯录权限', description: '读取企业通讯录', permissions: ['读取全部联系人', '读取组织架构', '搜索联系人'], status: 'enabled', createTime: '2024-01-15 10:00:00' },
  4: { name: '云空间', description: '访问云文档', permissions: ['读取文档', '创建文档', '管理文档'], status: 'enabled', createTime: '2024-01-20 14:30:00' },
};
```

**操作**: "禁用此能力"按钮 (danger类型)

### 6.6 ApiManagement (API管理页)
**路由**: `/api-management?appId=xxx`

**表格列**: 权限名称、codeName(Code显示)、认证方式、分类、状态(Tag: 已审核绿色, 审核中橙色, 已中止红色)、操作

**Mock数据**:
```javascript
export const mockApis = [
  { id: 1, name: '获取用户信息', codeName: 'user.get', auth: 'SOA', category: '用户管理', status: '已审核' },
  { id: 2, name: '发送消息', codeName: 'message.send', auth: 'APIG', category: '消息推送', status: '审核中' },
  { id: 3, name: '创建日历事件', codeName: 'calendar.event.create', auth: 'APIG', category: '日历管理', status: '已中止' },
  { id: 4, name: '更新通讯录', codeName: 'contact.update', auth: 'SOA', category: '通讯录', status: '审核中' },
];
```

**功能**: "添加API"按钮打开Drawer

### 6.7 ApiPermissionDrawer (API权限抽屉)
**文件**: `src/pages/ApiManagement/ApiPermissionDrawer.jsx`

**结构**:
- 顶部: Tabs切换 (SOA类型 / APIG类型)
- 左侧: 模块分类列表
- 右侧: API表格 (复选框选择) + 分页

**Mock数据**: 完整数据见 `src/pages/ApiManagement/mock.js`
- SOA类型: 4个模块, 12个API
- APIG类型: 5个模块, 14个API

**交互**: 选择API后点击"确认开通权限", 状态根据needReview判断

### 6.8 Events (事件配置页)
**路由**: `/events?appId=xxx`

**结构**:
1. **订阅方式**: Radio选择 "MQS平台订阅" / "将事件发送至业务系统"
   - MQS: 显示MQS文档链接
   - 业务系统: 显示回调地址输入框
   - "编辑"按钮进入编辑模式

2. **已添加事件**: 表格(事件名称、事件类型、所需权限、操作)
   - "添加事件"按钮打开Drawer

**Mock数据**:
```javascript
export const mockEvents = [
  { id: 1, name: '用户进入应用', event: 'app_open', status: 'enabled', eventType: '业务应用', permission: '读取应用信息' },
  { id: 2, name: '消息被撤回', event: 'message_revoke', status: 'enabled', eventType: '个人应用', permission: '读取消息记录' },
  // 共8条
];
export const mockAllEvents = [15条可选事件];
```

### 6.9 VersionRelease (版本发布页)
**路由**: `/version-release?appId=xxx`

**结构**: 标题 + "创建新版本"按钮 + List展示版本历史

**Mock数据**:
```javascript
export const mockVersions = [
  { id: 1, version: '1.0.0', status: '已发布', time: '2024-01-15 10:00', desc: '初始版本' },
  { id: 2, version: '0.9.0', status: '已发布', time: '2024-01-10 15:30', desc: '测试版' },
  { id: 3, version: '0.8.0', status: '已废弃', time: '2024-01-05 09:00', desc: '内测版' },
];
```

---

## 7. 路由配置

**文件**: `src/App.jsx`

```javascript
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<AppList />} />
    <Route path="basic-info" element={<BasicInfo />} />
    <Route path="members" element={<Members />} />
    <Route path="capabilities" element={<Capabilities />} />
    <Route path="capability/:capabilityId" element={<CapabilityDetail />} />
    <Route path="api-management" element={<ApiManagement />} />
    <Route path="events" element={<Events />} />
    <Route path="version-release" element={<VersionRelease />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```

---

## 8. 主题配置

**文件**: `src/App.jsx` (ConfigProvider)

```javascript
theme: {
  token: {
    colorPrimary: '#0066ff',
    borderRadius: 6,
  },
}
```

---

## 9. 主内容区背景

```javascript
background: 'linear-gradient(180deg, #f7f9fc 0%, #f0f4f9 100%)'
```

---

## 10. 通用样式模式

```less
.page {
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  padding: 24px;
  min-height: 100%;
  box-sizing: border-box;
}
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}
.page-desc {
  font-size: 13px;
  color: var(--text-tertiary);
}
```

---

## 11. 总结

这是一个典型的中后台管理系统:
- **架构**: React + React Router SPA
- **UI库**: Ant Design
- **样式**: Less + CSS变量
- **布局**: 顶部Header + 条件渲染的AppInfoBar + 侧边栏 + 主内容区
- **状态**: 本地useState + URL参数传递
- **数据**: Mock数据存储在各页面的mock.js文件中

文档包含足够的信息让AI根据这些数据重建整个项目。