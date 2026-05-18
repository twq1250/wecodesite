/**
 * ========================================
 * 连接器管理 - 编辑弹窗组件
 * ========================================
 * 
 * 支持三种模式：
 * - create: 创建新连接器
 * - edit: 编辑已有连接器
 * - view: 查看连接器详情
 */

import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Switch, 
  Tabs, 
  Button, 
  Space, 
  message,
  Select,
  Divider,
  Popconfirm,
  Tag,
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { createConnector, updateConnector, fetchConnectorDetail } from './thunk';
import { pageInfo } from './constants';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 连接器编辑弹窗组件
 */
const ConnectorModal = ({ 
  visible, 
  data, 
  mode, 
  onSuccess, 
  onCancel 
}) => {
  /**
   * State定义
   */
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 触发事件列表
  const [triggers, setTriggers] = useState([]);
  
  // 执行动作列表
  const [actions, setActions] = useState([]);
  
  // 当前编辑的触发事件
  const [editingTrigger, setEditingTrigger] = useState(null);
  
  // 当前编辑的执行动作
  const [editingAction, setEditingAction] = useState(null);

  /**
   * 派生状态
   */
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isCreate = mode === 'create';

  /**
   * 副作用
   */
  useEffect(() => {
    if (visible) {
      if (isEdit && data?.id) {
        loadDetail(data.id);
      } else {
        // 重置表单
        form.resetFields();
        setTriggers([]);
        setActions([]);
        setEditingTrigger(null);
        setEditingAction(null);
      }
    }
  }, [visible, data, mode]);

  /**
   * 加载连接器详情
   * @param {string} id - 连接器ID
   */
  const loadDetail = async (id) => {
    const result = await fetchConnectorDetail(id);
    
    if (result && result.code === '200') {
      const connectorData = result.data;
      
      // 设置表单数据
      form.setFieldsValue({
        name: connectorData.name,
        description: connectorData.description,
        status: connectorData.status === 1,
      });
      
      // 设置触发事件和执行动作列表
      setTriggers(connectorData.triggers || []);
      setActions(connectorData.actions || []);
    } else {
      message.error(result?.message || '加载连接器详情失败');
    }
  };

  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    try {
      // 表单验证
      const values = await form.validateFields();
      setLoading(true);

      // 构建提交数据
      const payload = {
        name: values.name,
        description: values.description || '',
        status: values.status ? 1 : 0,
        triggers,
        actions,
      };

      // 调用API
      const api = isEdit ? updateConnector : createConnector;
      const params = isEdit ? [data.id, payload] : [payload];
      const result = await api(...params);

      if (result && result.code === '200') {
        message.success(isEdit ? '更新成功' : '创建成功');
        onSuccess();
      } else {
        message.error(result?.message || '操作失败');
      }
    } catch (error) {
      // 表单验证错误不需要额外处理，antd会自动显示
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 触发事件管理 - 新增
   */
  const handleAddTrigger = () => {
    setEditingTrigger({
      id: null,
      name: '',
      description: '',
      type: 'webhook',
      config: {},
    });
  };

  /**
   * 触发事件管理 - 编辑
   */
  const handleEditTrigger = (trigger) => {
    setEditingTrigger({ ...trigger });
  };

  /**
   * 触发事件管理 - 保存
   */
  const handleSaveTrigger = () => {
    if (!editingTrigger.name || !editingTrigger.name.trim()) {
      message.error('请输入触发事件名称');
      return;
    }

    if (editingTrigger.id) {
      setTriggers(triggers.map(t => 
        t.id === editingTrigger.id ? editingTrigger : t
      ));
    } else {
      setTriggers([...triggers, { 
        ...editingTrigger, 
        id: `trigger_${Date.now()}` 
      }]);
    }
    
    setEditingTrigger(null);
    message.success('保存成功');
  };

  /**
   * 触发事件管理 - 删除
   */
  const handleDeleteTrigger = (id) => {
    setTriggers(triggers.filter(t => t.id !== id));
    message.success('删除成功');
  };

  /**
   * 执行动作管理 - 新增
   */
  const handleAddAction = () => {
    setEditingAction({
      id: null,
      name: '',
      description: '',
      method: 'GET',
      endpoint: '',
      requestSchema: {},
      responseSchema: {},
    });
  };

  /**
   * 执行动作管理 - 编辑
   */
  const handleEditAction = (action) => {
    setEditingAction({ ...action });
  };

  /**
   * 执行动作管理 - 保存
   */
  const handleSaveAction = () => {
    if (!editingAction.name || !editingAction.name.trim()) {
      message.error('请输入执行动作名称');
      return;
    }

    if (editingAction.id) {
      setActions(actions.map(a => 
        a.id === editingAction.id ? editingAction : a
      ));
    } else {
      setActions([...actions, { 
        ...editingAction, 
        id: `action_${Date.now()}` 
      }]);
    }
    
    setEditingAction(null);
    message.success('保存成功');
  };

  /**
   * 执行动作管理 - 删除
   */
  const handleDeleteAction = (id) => {
    setActions(actions.filter(a => a.id !== id));
    message.success('删除成功');
  };

  /**
   * 渲染Tab内容
   */
  const renderTabItems = () => [
    {
      key: 'basic',
      label: '基本信息',
      children: renderBasicInfo(),
    },
    {
      key: 'triggers',
      label: `触发事件 (${triggers.length})`,
      children: renderTriggerForm(),
    },
    {
      key: 'actions',
      label: `执行动作 (${actions.length})`,
      children: renderActionForm(),
    },
  ];

  /**
   * 渲染基本信息表单
   */
  const renderBasicInfo = () => (
    <Form 
      form={form} 
      layout="vertical"
      disabled={isView}
    >
      <Form.Item
        name="name"
        label="连接器名称"
        rules={[
          { required: true, message: '请输入连接器名称' },
          { max: 50, message: '名称不能超过50个字符' }
        ]}
      >
        <Input 
          placeholder="请输入连接器名称" 
          maxLength={50} 
          showCount 
          disabled={isView}
        />
      </Form.Item>
      
      <Form.Item 
        name="description" 
        label="连接器描述"
        rules={[
          { max: 500, message: '描述不能超过500个字符' }
        ]}
      >
        <TextArea 
          placeholder="请输入连接器描述" 
          maxLength={500} 
          showCount 
          rows={4} 
          disabled={isView}
        />
      </Form.Item>
      
      <Form.Item 
        name="status" 
        label="状态" 
        valuePropName="checked"
        tooltip="启用后，该连接器可以在流程中被使用"
      >
        <Switch 
          checkedChildren="启用" 
          unCheckedChildren="禁用"
          disabled={isView}
        />
      </Form.Item>
    </Form>
  );

  /**
   * 渲染触发事件表单
   */
  const renderTriggerForm = () => (
    <div className="trigger-form">
      {/* 触发事件列表 */}
      {triggers.map(trigger => (
        <div key={trigger.id} className="trigger-item">
          <div className="trigger-item-content">
            <div className="trigger-item-info">
              <span className="trigger-name">{trigger.name}</span>
              <span className="trigger-type">
                {trigger.type === 'webhook' ? 'Webhook' : 
                 trigger.type === 'api' ? 'API轮询' : '定时触发'}
              </span>
            </div>
            {trigger.description && (
              <div className="trigger-desc">{trigger.description}</div>
            )}
          </div>
          {!isView && (
            <Space>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditTrigger(trigger)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除"
                description="确定要删除这个触发事件吗？"
                onConfirm={() => handleDeleteTrigger(trigger.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>
      ))}

      {/* 新增按钮 */}
      {!isView && (
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={handleAddTrigger}
          block
          style={{ marginTop: 16 }}
        >
          添加触发事件
        </Button>
      )}

      {/* 编辑表单 */}
      {editingTrigger && (
        <div className="trigger-edit-form">
          <Divider>编辑触发事件</Divider>
          <Form layout="vertical">
            <Form.Item label="事件名称" required>
              <Input 
                value={editingTrigger.name} 
                onChange={e => setEditingTrigger({ 
                  ...editingTrigger, 
                  name: e.target.value 
                })}
                placeholder="例如：用户创建事件"
                disabled={isView}
              />
            </Form.Item>
            
            <Form.Item label="事件描述">
              <Input 
                value={editingTrigger.description} 
                onChange={e => setEditingTrigger({ 
                  ...editingTrigger, 
                  description: e.target.value 
                })}
                placeholder="请输入事件描述"
                disabled={isView}
              />
            </Form.Item>
            
            <Form.Item label="触发类型">
              <Select 
                value={editingTrigger.type} 
                onChange={val => setEditingTrigger({ 
                  ...editingTrigger, 
                  type: val 
                })}
                disabled={isView}
              >
                <Option value="webhook">Webhook</Option>
                <Option value="api">API轮询</Option>
                <Option value="schedule">定时触发</Option>
              </Select>
            </Form.Item>
          </Form>
          
          {!isView && (
            <Space>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleSaveTrigger}
              >
                保存
              </Button>
              <Button onClick={() => setEditingTrigger(null)}>取消</Button>
            </Space>
          )}
        </div>
      )}
    </div>
  );

  /**
   * 渲染执行动作表单
   */
  const renderActionForm = () => (
    <div className="action-form">
      {/* 执行动作列表 */}
      {actions.map(action => (
        <div key={action.id} className="action-item">
          <div className="action-item-content">
            <div className="action-item-info">
              <span className="action-name">{action.name}</span>
              <span className="action-method">
                <Tag color={
                  action.method === 'GET' ? 'green' :
                  action.method === 'POST' ? 'blue' :
                  action.method === 'PUT' ? 'orange' : 'red'
                }>
                  {action.method}
                </Tag>
                <span className="action-endpoint">{action.endpoint}</span>
              </span>
            </div>
            {action.description && (
              <div className="action-desc">{action.description}</div>
            )}
          </div>
          {!isView && (
            <Space>
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => handleEditAction(action)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除"
                description="确定要删除这个执行动作吗？"
                onConfirm={() => handleDeleteAction(action.id)}
                okText="确认"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>
      ))}

      {/* 新增按钮 */}
      {!isView && (
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={handleAddAction}
          block
          style={{ marginTop: 16 }}
        >
          添加执行动作
        </Button>
      )}

      {/* 编辑表单 */}
      {editingAction && (
        <div className="action-edit-form">
          <Divider>编辑执行动作</Divider>
          <Form layout="vertical">
            <Form.Item label="动作名称" required>
              <Input 
                value={editingAction.name} 
                onChange={e => setEditingAction({ 
                  ...editingAction, 
                  name: e.target.value 
                })}
                placeholder="例如：发送消息"
                disabled={isView}
              />
            </Form.Item>
            
            <Form.Item label="动作描述">
              <Input 
                value={editingAction.description} 
                onChange={e => setEditingAction({ 
                  ...editingAction, 
                  description: e.target.value 
                })}
                placeholder="请输入动作描述"
                disabled={isView}
              />
            </Form.Item>
            
            <Form.Item label="请求方法">
              <Select 
                value={editingAction.method} 
                onChange={val => setEditingAction({ 
                  ...editingAction, 
                  method: val 
                })}
                disabled={isView}
              >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="API端点">
              <Input 
                value={editingAction.endpoint} 
                onChange={e => setEditingAction({ 
                  ...editingAction, 
                  endpoint: e.target.value 
                })}
                placeholder="/api/v1/xxx"
                disabled={isView}
              />
            </Form.Item>
          </Form>
          
          {!isView && (
            <Space>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={handleSaveAction}
              >
                保存
              </Button>
              <Button onClick={() => setEditingAction(null)}>取消</Button>
            </Space>
          )}
        </div>
      )}
    </div>
  );

  /**
   * 渲染
   */
  return (
    <Modal
      title={isCreate ? '新建连接器' : isEdit ? '编辑连接器' : '连接器详情'}
      open={visible}
      onOk={isView ? onCancel : handleSubmit}
      onCancel={onCancel}
      width={800}
      confirmLoading={loading}
      okText={isCreate ? '创建' : isEdit ? '更新' : '关闭'}
      cancelText="取消"
      maskClosable={false}
      destroyOnClose
    >
      <Tabs 
        items={renderTabItems()} 
        defaultActiveKey="basic"
      />
    </Modal>
  );
};

export default ConnectorModal;
