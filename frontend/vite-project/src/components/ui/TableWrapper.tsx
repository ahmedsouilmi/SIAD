import React from "react";

interface TableWrapperProps {
  title?: string;
  children: React.ReactNode;
}

const TableWrapper: React.FC<TableWrapperProps> = ({ title, children }) => {
  return (
    <div className="card mb-3">
      {title && (
        <div className="card-header">
          <strong>{title}</strong>
        </div>
      )}
      <div className="card-body p-0">{children}</div>
    </div>
  );
};

export default TableWrapper;
