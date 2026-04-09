import React from 'react';
import DataTableLib from 'react-data-table-component';

const DataTable = DataTableLib.default || DataTableLib;

const Table = ({ columns, data, loading }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      progressPending={loading}
      pagination
      highlightOnHover
      pointerOnHover
    />
  );
};

export default Table;