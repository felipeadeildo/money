import { useCallback, useEffect, useState } from 'react'
import { getTransactions } from '../db/transactions'
import { Transaction } from '../types/types'

export function useTransactions({
  accountId,
  page = 1,
  pageSize = 20,
}: {
  accountId?: string
  page?: number
  pageSize?: number
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    let all = await getTransactions()
    if (accountId) {
      all = all.filter(
        (t) => t.fromAccountId === accountId || t.toAccountId === accountId
      )
    }
    setTotal(all.length)
    const start = (page - 1) * pageSize
    setTransactions(all.slice(start, start + pageSize))
    setLoading(false)
  }, [accountId, page, pageSize])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    total,
    refresh: fetchTransactions,
  }
}
