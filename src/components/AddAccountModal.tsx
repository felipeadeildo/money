import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors, fontSizes, spacing } from '../theme'

type Props = {
  visible: boolean
  onClose: () => void
  onAdd: (name: string, initialBalance: number) => void
  loading?: boolean
}

export function AddAccountModal({ visible, onClose, onAdd, loading }: Props) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [nameError, setNameError] = useState('')

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (!numericValue) return ''

    const numberValue = parseInt(numericValue) / 100
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (!numericValue) return 0
    return parseInt(numericValue) / 100
  }

  const handleBalanceChange = (value: string) => {
    const formatted = formatCurrency(value)
    setBalance(formatted)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (nameError && value.trim()) {
      setNameError('')
    }
  }

  const handleAdd = () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setNameError('Nome da conta é obrigatório')
      return
    }

    if (trimmedName.length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres')
      return
    }

    const balanceValue = parseCurrency(balance)
    onAdd(trimmedName, balanceValue)

    // Reset form
    setName('')
    setBalance('')
    setNameError('')
  }

  const handleClose = () => {
    setName('')
    setBalance('')
    setNameError('')
    onClose()
  }

  const isValid = name.trim().length >= 2

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Conta</Text>
            <Text style={styles.subtitle}>
              Crie uma conta para organizar suas transações
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da conta</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Ex: Nubank, Carteira, Poupança..."
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={handleNameChange}
                autoFocus
                maxLength={50}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Saldo inicial</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.muted}
                value={balance}
                onChangeText={handleBalanceChange}
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>
                Valor atual disponível na conta
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                !isValid || loading ? styles.buttonDisabled : null,
              ]}
              onPress={handleAdd}
              disabled={!isValid || loading}
            >
              <Text
                style={[
                  styles.buttonPrimaryText,
                  !isValid || loading ? styles.buttonDisabledText : null,
                ]}
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    width: '90%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.muted,
    lineHeight: 20,
  },
  form: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text,
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
  actions: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonPrimaryText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.white,
  },
  buttonSecondaryText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  buttonDisabledText: {
    color: colors.muted,
  },
})
