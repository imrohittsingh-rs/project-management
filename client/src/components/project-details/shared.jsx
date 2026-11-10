import { FiLoader } from 'react-icons/fi'

// Shared form input
export const Input = ({ label, id, error, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#171717] mb-1.5">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full h-9 px-3 text-sm bg-white border ${error ? 'border-[#ee0000]' : 'border-[#ebebeb]'} rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-[#ee0000]">{error}</p>}
  </div>
)

export const Textarea = ({ label, id, error, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#171717] mb-1.5">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className={`w-full px-3 py-2 text-sm bg-white border ${error ? 'border-[#ee0000]' : 'border-[#ebebeb]'} rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors resize-none`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-[#ee0000]">{error}</p>}
  </div>
)

export const ActionBtn = ({ onClick, disabled, loading, type = 'button', children, variant = 'primary', className = '' }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-medium rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[#171717] text-white hover:bg-[#4d4d4d]',
    secondary: 'bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa]',
    danger: 'bg-white text-[#ee0000] border border-[#fecaca] hover:bg-[#fff5f5]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

/* ─── Tasks Tab ──────────────────────────────────────────────────── */
