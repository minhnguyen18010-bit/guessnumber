import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  active?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  active = false,
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 font-display font-bold uppercase tracking-widest transition-all duration-300 clip-path-polygon transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-900 text-neon-blue border border-neon-blue hover:bg-neon-blue hover:text-black shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]",
    secondary: "bg-purple-900 text-neon-purple border border-neon-purple hover:bg-neon-purple hover:text-white shadow-[0_0_10px_rgba(188,19,254,0.3)] hover:shadow-[0_0_20px_rgba(188,19,254,0.6)]",
    danger: "bg-red-900 text-neon-red border border-neon-red hover:bg-neon-red hover:text-black shadow-[0_0_10px_rgba(255,0,60,0.3)] hover:shadow-[0_0_20px_rgba(255,0,60,0.6)]",
    ghost: "bg-transparent text-slate-400 border border-slate-700 hover:border-slate-400 hover:text-white"
  };

  const activeStyle = active ? "bg-opacity-100 ring-2 ring-white" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${activeStyle} ${className}`}
      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
      {...props}
    >
      {children}
    </button>
  );
};