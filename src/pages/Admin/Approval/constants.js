export const STATUS_MAP = {
  0: { text: '待审', color: 'orange' },
  1: { text: '已通过', color: 'green' },
  2: { text: '已拒绝', color: 'red' },
  3: { text: '已撤销', color: 'default' },
};

export const APPROVAL_TYPE_MAP = {
  'resource_register': '资源注册',
  'permission_apply': '权限申请',
};

export const APPROVAL_TABS = [
  { key: 'pending', label: '我的待审' },
  { key: 'mine', label: '我发起的' },
  { key: 'all', label: '全部' },
];

export const getApprovalColumns = ({
  renderApprovalType,
  renderStatus,
  renderAction,
}) => [
  {
    title: '申请编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '申请人',
    dataIndex: 'applicantName',
    key: 'applicantName',
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    key: 'businessType',
  },
  {
    title: '业务名称',
    dataIndex: 'businessName',
    key: 'businessName',
  },
  {
    title: '审批类型',
    dataIndex: 'type',
    key: 'type',
    render: renderApprovalType,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: renderStatus,
  },
  {
    title: '操作',
    key: 'action',
    render: renderAction,
  },
];

export const getMyApprovalColumns = ({
  renderApprovalType,
  renderStatus,
  renderAction,
}) => [
  {
    title: '申请编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    key: 'businessType',
  },
  {
    title: '业务名称',
    dataIndex: 'businessName',
    key: 'businessName',
  },
  {
    title: '审批类型',
    dataIndex: 'type',
    key: 'type',
    render: renderApprovalType,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: renderStatus,
  },
  {
    title: '操作',
    key: 'action',
    render: renderAction,
  },
];
