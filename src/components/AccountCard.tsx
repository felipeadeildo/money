import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { colors, fontSizes, spacing } from '../theme'
import { Account } from '../types/types'

type AccountCardProps = {
  item: Account
  index: number
  onRemove: (id: string) => void
}

export function AccountCard({ item, index, onRemove }: AccountCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const animatedValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start()
  }, [animatedValue, index])

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  const handleDeletePress = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    onRemove(item.id)
    setShowDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const isPositive = item.initialBalance >= 0

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.content}>
            <View style={styles.leftSection}>
              <View style={styles.indicator} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.createdDate}>
                  Criado em {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text
                style={[
                  styles.balance,
                  { color: isPositive ? colors.text : colors.danger },
                ]}
              >
                {formatCurrency(item.initialBalance)}
              </Text>

              <TouchableOpacity
                onPress={handleDeletePress}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Modal de Confirmação */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.warningIcon}>
                <Ionicons name="warning" size={24} color={colors.danger} />
              </View>
              <Text style={styles.modalTitle}>Deletar Conta</Text>
              <Text style={styles.modalMessage}>
                Tem certeza que deseja deletar a conta &quot;{item.name}&quot;?
                Esta ação não pode ser desfeita.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButtonModal]}
                onPress={handleConfirmDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  createdDate: {
    fontSize: fontSizes.sm,
    color: colors.muted,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  balance: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  deleteButton: {
    padding: spacing.xs,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    width: '85%',
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
  modalHeader: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  warningIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: spacing.md,
    borderRadius: 50,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: fontSizes.md,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: 0,
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
  deleteButtonModal: {
    backgroundColor: colors.danger,
  },
  cancelButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
  },
  deleteButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.white,
  },
})
