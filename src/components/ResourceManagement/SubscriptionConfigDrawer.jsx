import React, { useState, useEffect } from 'react';
import { Drawer, Form, Radio, Input, Button, message } from 'antd';
import { CALLBACK_CHANNEL_TYPE, EVENT_CHANNEL_TYPE, AUTH_TYPE } from '../../utils/constants';
import { queryParams } from '../../utils/common';
import './SubscriptionConfigDrawer.less';

/**
 * 通用订阅配置抽屉组件
 * 
 * 功能：
 * - 合并 CallbackConfigDrawer 和 EventSubscriptionDrawer
 * - 通过 itemType 参数区分业务类型
 * 
 * @param {boolean} open - 抽屉显示状态
 * @param {Function} onClose - 关闭抽屉回调
 * @param {Function} onSave - 保存后回调
 * @param {string} itemType - 资源类型：'callback' | 'event'
 * @param {Object} item - 当前编辑的资源
 */
function SubscriptionConfigDrawer({ 
  open, 
  onClose, 
  onSave, 
  itemType, 
  item,
  configThunk,
}) {
  const [form] = Form.useForm();
  const [channelType, setChannelType] = useState(0);
  const [saving, setSaving] = useState(false);
  const appId = queryParams('appId');

  // 获取通道类型映射
  const getChannelTypeMap = () => {
    return itemType === 'callback' ? CALLBACK_CHANNEL_TYPE : EVENT_CHANNEL_TYPE;
  };

  // 获取抽屉标题
  const getDrawerTitle = () => {
    return itemType === 'callback' ? '回调方式' : '订阅方式';
  };

  // 获取资源名称字段
  const getResourceName = () => {
    return itemType === 'callback' ? '回调名称' : '事件名称';
  };

  useEffect(() => {
    if (item && open) {
      form.setFieldsValue({
        channelType: item.channelType ?? 0,
        channelAddress: item.channelAddress || '',
        authType: item.authType ?? 0
      });
      setChannelType(item.channelType ?? 0);
    }
  }, [item, open, form]);

  const handleChannelTypeChange = (e) => {
    const newChannelType = e.target.value;
    setChannelType(newChannelType);
    
    const updateFields = { channelType: newChannelType };
    
    // 事件类型切换到 WebHook 时重置认证类型
    if (itemType === 'event' && newChannelType === 1) {
      updateFields.authType = 0;
    }
    
    form.setFieldsValue(updateFields);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const res = await configThunk(appId, item.id, {
        channelType: values.channelType,
        channelAddress: values.channelAddress || '',
        authType: values.authType
      });
      if (res && res.code === '200') {
        message.success('配置已保存');
        onSave();
        onClose();
      } else {
        message.error(res?.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const channelTypeMap = getChannelTypeMap();

  return (
    <Drawer
      title={getDrawerTitle()}
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      className="subscription-config-drawer"
      footer={
        <div className="drawer-footer">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave} loading={saving}>
            保存
          </Button>
        </div>
      }
    >
      {item && (
        <div className="item-info">
          <div className="info-item">
            <span className="label">{getResourceName()}:</span>
            <span className="value">{item.permission?.nameCn}</span>
          </div>
          {itemType === 'event' && item.event?.topic && (
            <div className="info-item">
              <span className="label">Topic:</span>
              <span className="value">{item.event.topic}</span>
            </div>
          )}
          <div className="info-item">
            <span className="label">所需权限:</span>
            <span className="value">{item.permission?.nameCn}</span>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical" className="subscription-form">
        <Form.Item name="channelType" label="通道类型">
          <Radio.Group onChange={handleChannelTypeChange}>
            <Radio value={0}>{channelTypeMap[0]}</Radio>
            <Radio value={1}>{channelTypeMap[1]}</Radio>
            {itemType === 'callback' && channelTypeMap[2] && (
              <Radio value={2}>{channelTypeMap[2]}</Radio>
            )}
          </Radio.Group>
        </Form.Item>

        {/* 事件类型的MQS通道显示说明文档 */}
        {itemType === 'event' && channelType === 0 && (
          <Form.Item label="说明文档">
            <a href="https://example.com/mqs-docs" target="_blank" rel="noopener noreferrer">
              <span style={{ color: '#000' }}>查看</span>
              <span style={{ color: '#1890ff' }}>MQS内置消息队列使用规范</span>
            </a>
          </Form.Item>
        )}

        {/* WebHook通道显示地址和认证类型 */}
        {channelType === 1 && (
          <>
            <Form.Item
              name="channelAddress"
              label={itemType === 'callback' ? '回调地址' : '请求地址'}
              rules={[
                { required: true, message: `请输入${itemType === 'callback' ? '回调' : '请求'}地址` },
              ]}
            >
              <Input placeholder="https://your-domain.com/webhook" />
            </Form.Item>
            <Form.Item name="authType" label="认证类型">
              <Radio.Group>
                <Radio value={0}>{AUTH_TYPE[0]}</Radio>
                <Radio value={1}>{AUTH_TYPE[1]}</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        )}
      </Form>
    </Drawer>
  );
}

export default SubscriptionConfigDrawer;
