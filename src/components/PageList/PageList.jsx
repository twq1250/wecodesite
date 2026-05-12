import React from 'react';
import { Table, Pagination } from 'antd';
import { PAGE_SIZE_OPTIONS } from '../../utils/constants';
import './PageList.less';

const PageList = ({
  columns,
  dataSource,
  loading,
  pagination,
  onPageChange,
  rowKey = 'id',
  className = '',
}) => {
  return (
    <>
      <div className="table-wrapper">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={rowKey}
          pagination={false}
          loading={loading}
          className={className}
        />
      </div>

      {pagination.total > 0 && (
        <div className="pagination-wrapper">
          <Pagination
            current={pagination.curPage}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      )}
    </>
  );
};

export default PageList;
