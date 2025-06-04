import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors, fontSizes, spacing } from '../theme'
import { Account } from '../types/types'

type AddTransactionModalProps = {
  visible: boolean
  onClose: () => void
  onAdd: (amount: number, description: string, accountId: string) => void
  accounts: Account[]
  loading?: boolean
}

export function AddTransactionModal({
  visible,
  onClose,
  onAdd,
  accounts,
  loading = false,
}: AddTransactionModalProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [errors, setErrors] = useState<{
    amount?: string
    account?: string
  }>({})

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9-]/g, '')
    if (!numericValue) return ''

    const numberValue = parseInt(numericValue) / 100
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9-]/g, '')
    if (!numericValue) return 0
    return parseInt(numericValue) / 100
  }

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value)
    setAmount(formatted)
    if (errors.amount && value.trim()) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
  }

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId)
    if (errors.account) {
      setErrors((prev) => ({ ...prev, account: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!amount.trim()) {
      newErrors.amount = 'Valor é obrigatório'
    } else if (parseCurrency(amount) === 0) {
      newErrors.amount = 'Valor deve ser diferente de zero'
    }

    if (!selectedAccountId) {
      newErrors.account = 'Selecione uma conta'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validateForm()) return

    const amountValue = parseCurrency(amount)
    onAdd(amountValue, description.trim(), selectedAccountId)

    // Reset form
    setAmount('')
    setDescription('')
    setSelectedAccountId('')
    setErrors({})
  }

  const handleClose = () => {
    setAmount('')
    setDescription('')
    setSelectedAccountId('')
    setErrors({})
    onClose()
  }

  const isValid =
    amount.trim() && selectedAccountId && parseCurrency(amount) !== 0

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerIcon}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Nova Transação</Text>
            <Text style={styles.modalSubtitle}>
              Registre uma receita ou despesa
            </Text>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={[styles.input, errors.amount ? styles.inputError : null]}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
                autoFocus
              />
              {errors.amount ? (
                <Text style={styles.errorText}>{errors.amount}</Text>
              ) : (
                <Text style={styles.helpText}>
                  Use valores negativos para despesas
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Almoço, Salário, Combustível..."
                placeholderTextColor={colors.muted}
                value={description}
                onChangeText={handleDescriptionChange}
                maxLength={100}
                multiline
                numberOfLines={2}
              />
              <Text style={styles.helpText}>
                {description.length}/100 caracteres
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Conta</Text>
              {errors.account ? (
                <Text style={[styles.errorText, { marginBottom: spacing.sm }]}>
                  {errors.account}
                </Text>
              ) : null}

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.accountSelector}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountOption,
                        selectedAccountId === account.id &&
                          styles.accountOptionActive,
                        errors.account ? styles.accountOptionError : null,
                      ]}
                      onPress={() => handleAccountSelect(account.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.accountIndicator,
                          {
                            backgroundColor:
                              selectedAccountId === account.id
                                ? colors.primary
                                : colors.border,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.accountOptionText,
                          selectedAccountId === account.id &&
                            styles.accountOptionTextActive,
                        ]}
                      >
                        {account.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.saveButton,
                !isValid || loading ? styles.saveButtonDisabled : null,
              ]}
              onPress={handleAdd}
              disabled={!isValid || loading}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  !isValid || loading ? styles.saveButtonTextDisabled : null,
                ]}
              >
                {loading ? 'Salvando...' : 'Criar Transação'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    width: '90%',
    maxWidth: 420,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    backgroundColor: `${colors.primary}15`,
    padding: spacing.md,
    borderRadius: 50,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    textAlign: 'center',
  },
  form: {
    maxHeight: 400,
  },
  inputGroup: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  helpText: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  accountSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    minWidth: 80,
  },
  accountOptionActive: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  accountOptionError: {
    borderColor: colors.danger,
  },
  accountIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountOptionText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  accountOptionTextActive: {
    color: colors.primary,
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.lg,
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
  saveButtonDisabled: {
    backgroundColor: colors.border,
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
  saveButtonTextDisabled: {
    color: colors.muted,
  },
})
