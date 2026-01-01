import React from "react";

interface ChartWrapperProps {
  title?: string;
  children: React.ReactNode;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children }) => {
  return (
    <div className="card mb-3">
      {title && (
        <div className="card-header">
          <strong>{title}</strong>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default ChartWrapper;
