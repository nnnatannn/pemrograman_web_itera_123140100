import React from 'react';
import PropTypes from 'prop-types';
import './StatsCard.css';

function StatsCard({ title, count, percentage, variant, icon, subtitle }) {
  return (
    <div className={`stats-card card-${variant}`}>
      <div className="stats-card-main">
        <div className="stats-info">
          <span className="stats-title">{title}</span>
          <div className="stats-number-row">
            <span className="stats-count">{count}</span>
            {percentage !== undefined && (
              <span className="stats-pct-badge">{percentage}%</span>
            )}
          </div>
          {subtitle && <span className="stats-subtitle">{subtitle}</span>}
        </div>
        {icon && <div className="stats-icon-wrapper">{icon}</div>}
      </div>
      {percentage !== undefined && (
        <div className="stats-progress-track">
          <div
            className="stats-progress-fill"
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.number,
  variant: PropTypes.oneOf(['primary', 'milik', 'baca', 'beli']).isRequired,
  icon: PropTypes.node,
  subtitle: PropTypes.string,
};

export default StatsCard;
