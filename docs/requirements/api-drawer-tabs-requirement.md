# API管理抽屉弹窗-tabs分类动态展示需求文档

## 1. 概述

本文档描述API管理抽屉弹窗中tabs组件的动态展示逻辑，根据应用类型（业务应用/个人应用）以及模拟后端开关状态，动态展示不同的tabs分类。

## 2. 名词定义

| 术语 | 定义 |
|------|------|
| 业务应用 | 当前应用绑定了EAMAP（Enterprise Application Management Access Point） |
| 个人应用 | 当前应用未绑定EAMAP |
| AKSK | Access Key and Secret Key，用于个人应用的身份验证方式 |

## 3. 功能需求

### 3.1 应用类型判断

- **判断逻辑**：根据当前应用是否绑定EAMAP来确定应用类型
  - 已绑定EAMAP → 业务应用
  - 未绑定EAMAP → 个人应用

### 3.2 模拟后端接口

在 `src/pages/ApiManagement/mock.js` 中添加模拟接口：

```javascript
export const mockFeatureFlag = {
  enableIdentityPermission: true
};
```

### 3.3 Tabs分层结构

业务/个人身份权限tabs和SOA/APIG/AKSK是**两个独立的tabs层级**：

```
第一层tabs：业务身份权限 / 个人身份权限 (enableIdentityPermission=true时展示)
         ↓ 选择后切换到第二层
第二层tabs：SOA / APIG (业务应用)  
         或 AKSK (个人应用)
```

### 3.4 Tabs分类动态展示规则

#### 3.4.1 场景一：enableIdentityPermission = false

| 应用类型 | 第一层tabs | 第二层tabs | 默认选中 |
|----------|-----------|-----------|----------|
| 业务应用 | 不展示 | SOA、APIG | SOA |
| 个人应用 | 不展示 | AKSK | AKSK |

#### 3.4.2 场景二：enableIdentityPermission = true

| 应用类型 | 第一层tabs | 第二层tabs | 默认选中 |
|----------|------------|------------|----------|
| 业务应用 | 业务身份权限、个人身份权限 | SOA、APIG | 业务身份权限 + SOA |
| 个人应用 | 个人身份权限 | AKSK | 个人身份权限 + AKSK |

### 3.5 Tabs分类说明

| tabs key | 标签名称 | 所属层级 | 说明 |
|----------|----------|----------|------|
| BUSINESS_IDENTITY | 业务身份权限 | 第一层 | 业务应用的业务身份权限 |
| PERSONAL_IDENTITY | 个人身份权限 | 第一层 | 个人应用的个人身份权限 |
| SOA | SOA类型 | 第二层 | 业务应用的SOA服务类型API |
| APIG | APIG类型 | 第二层 | 业务应用的APIG网关类型API |
| AKSK | AKSK类型 | 第二层 | 个人应用的身份密钥类型API |

## 4. 数据结构设计

### 4.1 mock.js新增数据

```javascript
export const mockFeatureFlag = {
  enableIdentityPermission: true
};

// AKSK类型数据
export const availableApis = {
  SOA: { ... },
  APIG: { ... },
  AKSK: {
    modules: [
      { key: 'all', name: '所有' },
      { key: 'user', name: '用户凭证' },
      { key: 'system', name: '系统凭证' },
    ],
    apis: [
      // AKSK类型API数据
    ]
  }
};
```

### 4.2 组件状态设计

```javascript
const [appType, setAppType] = useState('business'); // 'business' | 'personal'
const [enableIdentityPermission, setEnableIdentityPermission] = useState(false);
const [activeIdentityType, setActiveIdentityType] = useState('business'); // BUSINESS_IDENTITY | PERSONAL_IDENTITY
const [activeApiType, setActiveApiType] = useState('SOA'); // SOA | APIG | AKSK
```

## 5. UI展示需求

### 5.1 业务应用 + enableIdentityPermission = false

```
[ SOA类型 ] [ APIG类型 ]
```

默认选中：SOA

### 5.2 个人应用 + enableIdentityPermission = false

```
[ AKSK类型 ]
```

默认选中：AKSK

### 5.3 业务应用 + enableIdentityPermission = true

```
[ 业务身份权限 ] [ 个人身份权限 ]  |  [ SOA类型 ] [ APIG类型 ]
↑ 默认��中                          ↑ 基于第一层选择联动
```

点击"业务身份权限"时，第二层默认选中SOA
点击"个人身份权限"时，第二层默认选中APIG

### 5.4 个人应用 + enableIdentityPermission = true

```
[ 个人身份权限 ] [ AKSK类型 ]
↑ 默认选中    ↑ 基于第一层选择联动
```

点击"个人身份权限"时，第二层默认选中AKSK

## 6. 实现步骤

1. 在 `mock.js` 中添加 `mockFeatureFlag` 模拟开关数据
2. 在 `mock.js` 中添加 `AKSK` 类型的模块和API数据
3. 在 `ApiPermissionDrawer.jsx` 中添加应用类型和应用身份权限开关状态
4. 实现双层tabs结构：
   - 第一层：业务/个人身份权限tabs（enableIdentityPermission为true时显示）
   - 第二层：SOA/APIG/AKSK tabs（根据应用类型显示）
5. 实现层级联动逻辑：第一层切换时重置第二层的默认选中项

## 7. 验收标准

- [ ] 业务应用（绑定EAMAP）+ enableIdentityPermission=false：展示SOA、APIG两个tabs，默认选中SOA
- [ ] 个人应用（未绑定EAMAP）+ enableIdentityPermission=false：仅展示AKSK一个tabs，默认选中AKSK
- [ ] 业务应用 + enableIdentityPermission=true：展示4个tabs（业务身份权限、个人身份权限、SOA、APIG），默认选中业务身份权限+SOA
- [ ] 个人应用 + enableIdentityPermission=true：展示2个tabs（个人身份权限、AKSK），默认选中个人身份权限+AKSK
- [ ] 点击第一层tabs时，第二层tabs能正确联动切换