import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'standard', 
  size = 'md',
  icon = null,
  disabled = false,
  className = ''
}) => {
  // Add w-fit or w-auto to make buttons only as wide as their content
  const baseStyles = "w-fit bg-white border border-black rounded-full shadow text-black hover:bg-gray-100 transition-colors";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-sm", 
    outline: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    link: "bg-transparent text-blue-600 hover:text-blue-700 hover:underline p-0",
  };
  
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className} inline-flex items-center justify-center`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;