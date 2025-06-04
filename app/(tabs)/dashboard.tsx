import { Ionicons } from '@expo/vector-icons'
import { nanoid } from 'nanoid/non-secure'
import React, { useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAccounts } from '../../src/hooks/useAccounts'
import { useTransactions } from '../../src/hooks/useTransactions'
import { colors, fontSizes, spacing } from '../../src/theme'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default function DashboardScreen() {
  const { accounts } = useAccounts()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const pageSize = 20
  const { transactions, loading, total, refresh } = useTransactions({
    accountId: selectedAccount,
    page,
    pageSize,
  })
  const [showAddModal, setShowAddModal] = useState(false)
  // Estado para inputs do modal
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const [accountId, setAccountId] = useState<string | undefined>()
  const [saving, setSaving] = useState(false)

  // Função para adicionar transação rápida
  async function handleAddTransaction() {
    if (!amount || !accountId) return
    setSaving(true)
    const { createTransaction } = await import('../../src/db/transactions')
    await createTransaction({
      id: nanoid(),
      amount: Number(amount.replace(',', '.')),
      date: new Date().toISOString(),
      fromAccountId: accountId,
      description: desc,
    })
    setAmount('')
    setDesc('')
    setAccountId(undefined)
    setShowAddModal(false)
    setSaving(false)
    refresh()
  }

  const renderTransaction = ({ item }: any) => (
    <View style={styles.txRow}>
      <View style={styles.txLeft}>
        <Text style={styles.txAmount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.txDesc} numberOfLines={1}>
          {item.description || '-'}
        </Text>
      </View>
      <View style={styles.txRight}>
        <Text style={styles.txDate}>{formatDate(item.date)}</Text>
        <Text style={styles.txAccount}>
          {accounts.find((a) => a.id === item.fromAccountId)?.name || ''}
        </Text>
      </View>
    </View>
  )

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.lg,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <View style={styles.filterRow}>
        <FlatList
          data={[{ id: undefined, name: 'Todas' }, ...accounts]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id || 'all'}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterBtn,
                selectedAccount === item.id && styles.filterBtnActive,
              ]}
              onPress={() => setSelectedAccount(item.id)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  selectedAccount === item.id && styles.filterBtnTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        }
        onEndReached={() => {
          if (transactions.length < total) setPage((p) => p + 1)
        }}
        onEndReachedThreshold={0.2}
      />
      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
      {/* Modal de adicionar transação */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nova Transação</Text>
            <TextInput
              style={styles.input}
              placeholder="Valor (ex: 100.00)"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição (opcional)"
              placeholderTextColor={colors.muted}
              value={desc}
              onChangeText={setDesc}
            />
            <View style={styles.accountPickerRow}>
              {accounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  style={[
                    styles.accountPickerBtn,
                    accountId === acc.id && styles.accountPickerBtnActive,
                  ]}
                  onPress={() => setAccountId(acc.id)}
                >
                  <Text
                    style={[
                      styles.accountPickerText,
                      accountId === acc.id && styles.accountPickerTextActive,
                    ]}
                  >
                    {acc.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddTransaction}
                disabled={saving || !amount || !accountId}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    color: colors.text,
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: colors.white,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  txAmount: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  txDesc: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txDate: {
    fontSize: fontSizes.sm,
    color: colors.muted,
  },
  txAccount: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    marginTop: 2,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40,
    fontSize: fontSizes.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    width: '90%',
    maxWidth: 400,
    padding: spacing.lg,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  accountPickerBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  accountPickerBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accountPickerText: {
    color: colors.text,
    fontWeight: '500',
  },
  accountPickerTextActive: {
    color: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  saveButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.white,
  },
})
