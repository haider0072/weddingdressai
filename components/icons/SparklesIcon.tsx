
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.5 5-5-1.5 5 5-5 5L10.5 14l-5 1.5L12 17l1.5-5 5 1.5-5-5 5-5L13.5 10l5-1.5Z" />
  </svg>
);

export default SparklesIcon;
