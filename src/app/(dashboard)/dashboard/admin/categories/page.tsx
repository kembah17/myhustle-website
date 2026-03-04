"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CatRow {
  id: string; slug: string; name: string; parent_id: string | null;
  icon: string | null; description: string | null;
  parent?: { name: string } | null
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<CatRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories')
    if (res.ok) setCategories(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This may affect businesses using this category.`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) fetchCategories()
    else alert('Failed to delete category')
  }

  // Group by parent
  const parents = categories.filter(c => !c.parent_id)
  const children = categories.filter(c => c.parent_id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hustle-dark">Categories</h2>
        <Link href="/dashboard/admin/categories/new"
          className="bg-hustle-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-hustle-blue/90 transition-colors">
          + Add Category
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Icon</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-hustle-muted">Parent</th>
              <th className="text-right px-4 py-3 font-medium text-hustle-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hustle-muted">No categories found</td></tr>
            ) : (
              <>
                {parents.map((p) => (
                  <>
                    <tr key={p.id} className="hover:bg-gray-50 bg-gray-50/50">
                      <td className="px-4 py-3">{p.icon || '📁'}</td>
                      <td className="px-4 py-3 font-semibold text-hustle-dark">{p.name}</td>
                      <td className="px-4 py-3 text-hustle-muted">{p.slug}</td>
                      <td className="px-4 py-3 text-hustle-muted">—</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Link href={`/dashboard/admin/categories/${p.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                    {children.filter(c => c.parent_id === p.id).map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 pl-8">{c.icon || '📄'}</td>
                        <td className="px-4 py-3 pl-8 text-hustle-dark">↳ {c.name}</td>
                        <td className="px-4 py-3 text-hustle-muted">{c.slug}</td>
                        <td className="px-4 py-3 text-hustle-muted">{p.name}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <Link href={`/dashboard/admin/categories/${c.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                          <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
                {children.filter(c => !parents.find(p => p.id === c.parent_id)).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{c.icon || '📄'}</td>
                    <td className="px-4 py-3 text-hustle-dark">{c.name}</td>
                    <td className="px-4 py-3 text-hustle-muted">{c.slug}</td>
                    <td className="px-4 py-3 text-hustle-muted">{c.parent?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link href={`/dashboard/admin/categories/${c.id}/edit`} className="text-hustle-blue hover:underline">Edit</Link>
                      <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
