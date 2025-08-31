type Props = {
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
}

export default function Input({ 
  name, 
  type = 'text', 
  placeholder, 
  required = false, 
  className = '',
  label 
}: Props) {
  const inputClasses = `w-full px-3 py-2 border border-sand rounded-lg focus:ring-2 focus:ring-clay focus:border-clay outline-none transition-all ${className}`
  
  if (label) {
    return (
      <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-ink">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      </div>
    )
  }
  
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className={inputClasses}
    />
  )
}