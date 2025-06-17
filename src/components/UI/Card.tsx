import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${
        hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;