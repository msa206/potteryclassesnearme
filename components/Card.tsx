type Props = {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: Props) {
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : ''
  
  return (
    <article className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-300 border border-sand/20 ${hoverClasses} ${className}`}>
      {children}
    </article>
  )
}