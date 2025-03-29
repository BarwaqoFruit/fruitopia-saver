
import React from "react";

type BarwaqoLogoProps = {
  className?: string;
};

const BarwaqoLogo: React.FC<BarwaqoLogoProps> = ({ className = "" }) => {
  return (
    <svg
      width="120"
      height="32"
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stylized B */}
      <path
        d="M12 4C8.7 4 6 6.2 6 10C6 12.3 7.2 14 9 15C6.8 16 5 18.1 5 21C5 25.4 8.1 28 12.5 28H24V23H14C12.3 23 11 22 11 20.2C11 18.4 12.3 17.2 14 17.2H24V12.2H13.5C11.8 12.2 10.5 11.2 10.5 9.6C10.5 8 11.8 7 13.5 7H24V4H12Z"
        fill="currentColor"
        className="text-gold"
      />
      
      {/* Text */}
      <path
        d="M30 6H33.5V26H30V6ZM36 6H39.5L45 17L50.5 6H54V26H50.5V12L46 21H44L39.5 12V26H36V6ZM57 6H68C71.3 6 74 8.7 74 12C74 14.5 72.2 16.5 69.8 17L74 26H70L66.2 17.5H60.5V26H57V6ZM67.5 14.5C69.4 14.5 70.5 13.4 70.5 12C70.5 10.6 69.4 9.5 67.5 9.5H60.5V14.5H67.5ZM84 6C90.1 6 95 10.9 95 16C95 21.1 90.1 26 84 26H76V6H84ZM84 22.5C88.1 22.5 91.5 19.1 91.5 16C91.5 12.9 88.1 9.5 84 9.5H79.5V22.5H84ZM108 26L103 19L98 26H94L101 16L94.5 6.5H98.5L103 13L107.5 6.5H111.5L105 16L112 26H108Z"
        fill="currentColor"
      />
      
      {/* Fruit */}
      <circle cx="118" cy="8" r="2" fill="#4CAF50" />
    </svg>
  );
};

export default BarwaqoLogo;
