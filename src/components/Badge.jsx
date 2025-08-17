import React from 'react';

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  const classes = `${baseClasses} ${colorClasses[color] || colorClasses.blue} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
