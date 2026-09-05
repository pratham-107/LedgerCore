import React from "react";

export const BeanOutline = ({
  color = "#f59e0b",
  className = "",
  size = 60,
  rotation = 0,
}) => {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`transition-transform duration-500 hover:scale-110 ${className}`}
    >
      {/* Organic jelly bean curved path */}
      <path
        d="M25 10 C45 0, 75 5, 88 20 C100 35, 92 52, 75 56 C55 60, 40 48, 30 45 C15 42, 5 35, 8 22 C10 12, 18 12, 25 10 Z"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.04"
      />
    </svg>
  );
};

export const BeanFilled = ({
  color = "#f97316",
  className = "",
  size = 70,
  rotation = 0,
  opacity = 1,
}) => {
  const gradientId = `bean-grad-${color.replace("#", "")}-${Math.floor(Math.random() * 1000)}`;
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 100 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)`, opacity }}
      className={`filter drop-shadow-md transition-transform duration-700 hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="20%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        d="M25 12 C45 2, 78 7, 90 24 C102 40, 93 56, 75 60 C53 64, 38 52, 28 48 C12 44, 4 36, 6 22 C8 12, 16 14, 25 12 Z"
        fill={`url(#${gradientId})`}
      />
      {/* Glossy reflection highlight */}
      <path
        d="M30 16 C48 10, 70 12, 78 20"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};
