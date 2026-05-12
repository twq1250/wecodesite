import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ACTION_CONFIG = {
  delete: {
    defaultTitle: '确认删除',
    defaultContent: '确定要删除吗？',
    confirmButtonText: '确认删除',
    loadingText: '删除中...',
    dangerColor: '#ff4d4f'
  },
  withdraw: {
    defaultTitle: '确认撤回',
    defaultContent: '确定要撤回吗？撤回后将无法恢复。',
    confirmButtonText: '确认撤回',
    loadingText: '撤回中...',
    dangerColor: '#faad14'
  }
};

function ActionConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  type = 'delete',
  title, 
  content, 
  loading,
  requireConfirmText = null 
}) {
  const [confirmText, setConfirmText] = useState('');
  
  const config = ACTION_CONFIG[type] || ACTION_CONFIG.delete;
  const modalTitle = title || config.defaultTitle;
  const modalContent = content || config.defaultContent;
  
  useEffect(() => {
    if (!open) {
      setConfirmText('');
    }
  }, [open]);

  const isConfirmDisabled = () => {
    if (requireConfirmText) {
      return loading || confirmText !== requireConfirmText;
    } else {
      return loading;
    }
  };

  const handleConfirm = () => {
    if (!isConfirmDisabled()) {
      onConfirm();
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <ExclamationCircleOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
        <div style={{ fontSize: 16, marginBottom: 8 }}>{modalTitle}</div>
        <div style={{ color: '#8c8c8c' }}>{modalContent}</div>
      </div>

      {requireConfirmText && (
        <div style={{ marginBottom: 16, padding: '0 20px' }}>
          <div style={{ marginBottom: 8, color: '#333' }}>
            请输入 <strong style={{ color: '#1677ff' }}>{requireConfirmText}</strong> 以确认：
          </div>
          <Input
            placeholder={`请输入 ${requireConfirmText}`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            status={confirmText && confirmText !== requireConfirmText ? 'error' : ''}
          />
          {confirmText && confirmText !== requireConfirmText && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 12 }}>
              输入不匹配，请重新输入
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', paddingBottom: 16 }}>
        <button 
          onClick={onClose}
          style={{ 
            marginRight: 8, 
            padding: '6px 24px', 
            border: '1px solid #d9d9d9', 
            background: '#fff',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        <button 
          onClick={handleConfirm}
          disabled={isConfirmDisabled()}
          style={{ 
            padding: '6px 24px', 
            background: config.dangerColor, 
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: isConfirmDisabled() ? 'not-allowed' : 'pointer',
            opacity: isConfirmDisabled() ? 0.7 : 1
          }}
        >
          {loading ? config.loadingText : config.confirmButtonText}
        </button>
      </div>
    </Modal>
  );
}

export default ActionConfirmModal;