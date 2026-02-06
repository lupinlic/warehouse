'use client'

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = 'medium',
}: Props) {
  if (!open) return null

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-xl',
    large: 'max-w-3xl',
    xlarge: 'max-w-5xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className={`relative z-10 w-full ${sizeClasses[size]} rounded bg-white shadow-lg max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b px-4 py-3 bg-white">
          <h2 className="font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 cursor-pointer "
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
