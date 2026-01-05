import { FC } from "react";

interface CardKPIProps {
  title: string;
  value: string | number;
  small?: string;
  // icon?: string;
  // iconColor?: string;
  // bgGradient?: string;
  trend?: "up" | "down" | null;
  delta?: string;
  deltaType?: "up" | "down";
}

const CardKPI: FC<CardKPIProps> = ({
  title,
  value,
  small,
  // icon,
  // iconColor = "#0d6efd",
  // bgGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  trend,
  delta,
  deltaType
}) => {
  return (
    <div
      className="card shadow-sm border-0 d-flex flex-column align-items-stretch justify-content-between kpi-card-modern"
      style={{
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        minHeight: '140px',
        minWidth: '140px',
        maxWidth: '160px',
        aspectRatio: '1/1',
        borderRadius: '1.2rem',
        boxShadow: '0 2px 16px 0 rgba(30,41,59,0.08)',
        background: '#fff',
        margin: '0 auto',
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(30,41,59,0.13)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 16px 0 rgba(30,41,59,0.08)';
      }}
    >
      {/* No icon or gradient bar */}
      <div className="mb-2 text-blue-900 text-sm font-semibold text-center tracking-wide drop-shadow-sm" style={{letterSpacing: '0.02em'}}>{title}</div>
      <div className="text-2xl font-extrabold text-indigo-600 text-center mb-1 drop-shadow-md" style={{fontFamily: 'Segoe UI, Arial, sans-serif'}}>{value}</div>
      {small && <div className="text-xs text-blue-400 text-center font-medium">{small}</div>}
      {delta && (
        <div className={`text-xs text-center mt-1 ${deltaType === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : null} {delta}
        </div>
      )}
    </div>
  );
};

export default CardKPI;
