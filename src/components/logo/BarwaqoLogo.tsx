
import React from "react";

type BarwaqoLogoProps = {
  className?: string;
};

const BarwaqoLogo: React.FC<BarwaqoLogoProps> = ({ className = "" }) => {
  return (
    <img 
      src="/barwaqo-logo.svg" 
      alt="Barwaqo Logo" 
      className={className}
    />
  );
};

export default BarwaqoLogo;
