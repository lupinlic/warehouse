'use client'

export default function ImportForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void
  onCancel: () => void
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div>
        <label className="label">Nhà cung cấp</label>
        <select className="input">
          <option>Công ty Thiết bị Viễn Thông A</option>
          <option>Công ty CNTT B</option>
        </select>
      </div>

      <div>
        <label className="label">Kho nhập</label>
        <select className="input">
          <option>Kho trung tâm</option>
          <option>Kho chi nhánh</option>
        </select>
      </div>

      <div>
        <label className="label">Ghi chú</label>
        <textarea className="input" rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary cursor-pointer hover:text-red-500"
        >
          Hủy
        </button>
        <button type="submit" className="btn-primary cursor-pointer">
          Lưu phiếu
        </button>
      </div>
    </form>
  )
}
