import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'skeleton' | 'card';
  height?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'spinner',
  height = '200px',
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-2rem h-2rem';
      case 'large': return 'w-6rem h-6rem';
      default: return 'w-4rem h-4rem';
    }
  };

  if (variant === 'skeleton') {
    return (
      <div className={`p-4 ${className}`}>
        <div className="flex flex-column gap-3">
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="80%" height="1.5rem" />
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="90%" height="1.5rem" />
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`w-full ${className}`} style={{ height }}>
        <div className="flex flex-column align-items-center justify-content-center h-full gap-3">
          <ProgressSpinner className={getSizeClass()} strokeWidth="4" />
          <p className="text-600 text-center m-0">{message}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`flex flex-column align-items-center justify-content-center gap-3 p-4 ${className}`}>
      <ProgressSpinner className={getSizeClass()} strokeWidth="4" />
      <p className="text-600 text-center m-0">{message}</p>
    </div>
  );
};

export default LoadingSpinner;