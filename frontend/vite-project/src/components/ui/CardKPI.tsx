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
      <div className="card-body d-flex flex-column justify-content-between p-0" style={{height: '100%'}}>
        <div className="mb-2">
          <h6 className="card-subtitle text-muted mb-1" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </h6>
          {small && (
            <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#374151', minHeight: '2.2em' }}>{small}</div>
          )}
        </div>
        <div>
          <div className="d-flex align-items-end justify-content-between">
            <h2 className="card-title mb-0" style={{ fontSize: '2rem', fontWeight: 700, color: '#212529' }}>
              {value}
            </h2>
            {(trend || delta) && (
              <span className={`badge ${
                (trend === 'up' || deltaType === 'up') ? 'bg-success' : (trend === 'down' || deltaType === 'down') ? 'bg-danger' : 'bg-secondary'
              }`} style={{ fontSize: '0.75rem' }}>
                {delta ? (
                  <>
                    {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : ''} {delta}
                  </>
                ) : trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
              </span>
            )}
          </div>
          {small && (
            <p className="card-text text-muted mt-2 mb-0" style={{ fontSize: '0.813rem' }}>
              {small}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardKPI;
