import React from 'react';
import './Button.css';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="btn-spinner" size={18} />}
      <span className={isLoading ? 'btn-content-hidden' : ''}>{children}</span>
    </button>
  );
}
