'use client'

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({
  open,
  title,
  onClose,
  children,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-xl rounded bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
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
