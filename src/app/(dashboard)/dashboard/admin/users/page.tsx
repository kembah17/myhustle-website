"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserRow {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const json = await res.json()
        setUsers(json.data || [])
        setTotalCount(json.count || 0)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">
          Users {!loading && <span className="text-hustle-muted font-normal">({totalCount})</span>}
        </h2>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Created</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Last Sign In</th>
                <th className="text-left px-4 py-3 font-medium text-hustle-muted">Email Confirmed</th>
                <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-hustle-dark">{u.email}</td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-hustle-muted text-xs">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      {u.email_confirmed_at ? (
                        <span className="text-green-600 text-xs">✓ Yes</span>
                      ) : (
                        <span className="text-red-600 text-xs">✗ No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/admin/businesses?claimed=claimed&search=`}
                        className="text-hustle-blue hover:underline text-xs"
                      >
                        View Businesses
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
