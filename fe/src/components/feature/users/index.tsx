'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import UserForm from './components/UserForm'
import { userColumns } from './components/columns'
import {
  users as usersMock,
  type MockUser,
} from '@/mock/users.mock'

export default function UsersView() {
  const [data, setData] = useState(usersMock)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MockUser | null>(
    null
  )

  const handleSave = (item: MockUser) => {
    setData((prev) => {
      const exists = prev.find((u) => u.id === item.id)

      if (exists) {
        return prev.map((u) =>
          u.id === item.id
            ? {
                ...item,
                password:
                  item.password || u.password,
              }
            : u
        )
      }

      return [...prev, item]
    })

    toast.success(
      editing
        ? 'Cập nhật người dùng thành công'
        : 'Thêm người dùng thành công'
    )

    setOpen(false)
    setEditing(null)
  }

  const handleDelete = (item: MockUser) => {
    if (!confirm('Xóa người dùng này?')) return
    setData((prev) => prev.filter((u) => u.id !== item.id))
    toast.success('Đã xóa người dùng')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý người dùng</h1>

        <button
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          + Thêm người dùng
        </button>
      </div>

      <DataTable
        columns={userColumns(
          (row) => {
            setEditing(row)
            setOpen(true)
          },
          handleDelete
        )}
        data={data}
      />

      <Modal
        open={open}
        title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      >
        <UserForm
          data={editing}
          onSubmit={handleSave}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
        />
      </Modal>
    </div>
  )
}
