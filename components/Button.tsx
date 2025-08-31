import React from 'react'

type Props = { 
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({ children, variant = 'primary', href, type = 'button', className = '' }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 transition-all duration-200 transform hover:scale-105 active:scale-95'
  
  const variants = {
    primary: `${base} bg-gradient-to-r from-clay to-clay/90 text-white hover:from-clay/90 hover:to-clay focus-visible:ring-clay shadow-lg shadow-clay/20`,
    secondary: `${base} bg-gradient-to-r from-teal to-teal/90 text-white hover:from-teal/90 hover:to-teal focus-visible:ring-teal shadow-lg shadow-teal/20`,
    ghost: `${base} text-ink hover:bg-sand/20 focus-visible:ring-clay`
  }
  
  const cls = `${variants[variant]} ${className}`
  
  if (href) {
    return <a className={cls} href={href}>{children}</a>
  }
  
  return <button className={cls} type={type}>{children}</button>
}