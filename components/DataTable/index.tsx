"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ColumnType = {
  title: string
  key: string
  sort?: boolean
  render?: (row: any) => React.ReactNode
}

type DataTableProps = {
  columns: ColumnType[]
  data: any[]
  pageSize?: number
}

export const DataTable = ({ columns, data, pageSize = 10 }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [page, setPage] = useState(1)

  const sortedData = useMemo(() => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize])

  const toggleSort = (key: string) => {
    setSortConfig(prev =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    )
  }

  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted text-left text-sm font-semibold">
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-2 border-b cursor-pointer select-none hover:bg-gray-100 transition"
                onClick={() => col.sort && toggleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.title}
                  {col.sort && sortConfig?.key === col.key && (
                    sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 text-sm">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2 border-t">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t text-sm bg-muted">
          <span>
            Хуудас {page} / {totalPages}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Өмнөх
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Дараах
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
