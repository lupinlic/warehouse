'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import UserForm from './components/UserForm'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import { userColumns } from './components/columns'
import { getUsers, createUser, updateUser, deleteUser, mapFormDataToApiPayload, createUserRaw, updateUserRaw } from '@/services/users'
import type { User, UserFormData } from '@/types/user'

export default function UsersView() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await getUsers()
      setData(res.data || [])
      console.log('Fetched users:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách người dùng')
      console.error('Fetch users error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: UserFormData) => {
    try {
      if (editing) {
        // Update: send exact API payload
        const payload = mapFormDataToApiPayload(item)
        const res = await updateUserRaw(editing.id, payload)
        toast.success('Cập nhật người dùng thành công')
        setData((prev) =>
          prev.map((u) =>
            u.id === editing.id
              ? res.data
              : u
          )
        )
      } else {
        // Create
        const payload = mapFormDataToApiPayload(item)
        const res = await createUserRaw(payload)
        toast.success('Thêm người dùng thành công')
        setData((prev) => [...prev, res.data])
        
      }

      setOpen(false)
      setEditing(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu người dùng')
      console.error('Save user error:', err)
    }
  }

  const handleDelete = async (item: User) => {
    setDeletingUser(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingUser) return

    try {
      await deleteUser(deletingUser.id)
      setData((prev) => prev.filter((u) => u.id !== deletingUser.id))
      toast.success('Đã xóa người dùng')
      setOpenDeleteModal(false)
      setDeletingUser(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa người dùng')
      console.error('Delete user error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý người dùng</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Thêm người dùng
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Đang tải...</div>
      ) : (
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
      )}

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

      <ConfirmDeleteModal
        open={openDeleteModal}
        itemName={deletingUser?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenDeleteModal(false)
          setDeletingUser(null)
        }}
      />
    </div>
  )
}
