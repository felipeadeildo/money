import { useCallback, useEffect, useState } from 'react'
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../db/accounts'
import { Account } from '../types/types'

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    const data = await getAccounts()
    setAccounts(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const addAccount = useCallback(
    async (account: Account) => {
      await createAccount(account)
      await fetchAccounts()
    },
    [fetchAccounts]
  )

  const editAccount = useCallback(
    async (account: Account) => {
      await updateAccount(account)
      await fetchAccounts()
    },
    [fetchAccounts]
  )

  const removeAccount = useCallback(
    async (id: string) => {
      await deleteAccount(id)
      await fetchAccounts()
    },
    [fetchAccounts]
  )

  return {
    accounts,
    loading,
    refresh: fetchAccounts,
    addAccount,
    editAccount,
    removeAccount,
  }
}
