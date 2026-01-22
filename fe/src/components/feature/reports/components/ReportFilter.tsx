'use client'

export default function ReportFilter() {
  return (
    <div className="bg-white border border-gray-200 rounded p-4 grid grid-cols-4 gap-4">
      <div>
        <label className="label">Từ ngày</label>
        <input type="date" className="input" />
      </div>

      <div>
        <label className="label">Đến ngày</label>
        <input type="date" className="input" />
      </div>

      <div>
        <label className="label">Kho</label>
        <select className="input">
          <option>Kho trung tâm</option>
          <option>Kho chi nhánh</option>
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button className="btn-primary cursor-pointer">
          Xem báo cáo
        </button>
        <button className="btn-success cursor-pointer">
          Xuất Excel
        </button>
      </div>
    </div>
  )
}
