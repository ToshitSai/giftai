import React from "react";

export const InteractiveButton = ({
  children,
  variant = "white",
  ariaLabel,
  className = "",
  ...props
}) => {
  // Map our neat neobrutalist variants
  const variantStyles = {
    pink: "bg-[#FF5A5F] text-white hover:bg-[#ff444a]",
    yellow: "bg-[#E8FF00] text-[#0F0A1A] hover:bg-[#d8ef00]",
    cyan: "bg-[#00E5FF] text-[#0F0A1A] hover:bg-[#00cce6]",
    purple: "bg-[#6E00FF] text-white hover:bg-[#5200c4]",
    white: "bg-white text-[#0F0A1A] hover:bg-gray-50",
    black: "bg-[#0F0A1A] text-white hover:bg-black",
  };

  return (
    <button
      aria-label={ariaLabel} // Fixed: Crucial for screen reader accessibility
      className={`
        btn-comic
        font-black
        uppercase
        tracking-wider
        rounded-xl
        border-4
        border-black
        px-6
        py-3
        shadow-[4px_4px_0_0_#000]
        
        /* FIXED: Added satisfying physical active pressed states */
        active:translate-x-[2px] 
        active:translate-y-[2px] 
        active:shadow-[2px_2px_0_0_#000]
        
        transition-all
        duration-100
        outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-[#6E00FF]
        
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
