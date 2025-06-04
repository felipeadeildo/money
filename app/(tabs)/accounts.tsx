import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native'

import { AccountCard } from '@/src/components/AccountCard'
import { AccountsHeader } from '@/src/components/AccountsHeader'
import { AddAccountModal } from '@/src/components/AddAccountModal'
import { AddButton } from '@/src/components/AddButton'
import { EmptyState } from '@/src/components/EmptyState'
import { useAccounts } from '@/src/hooks/useAccounts'
import { colors, fontSizes, spacing } from '@/src/theme'

export default function AccountsScreen() {
  const { accounts, loading, addAccount, removeAccount } = useAccounts()
  const [modalVisible, setModalVisible] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAddAccount = async (name: string, initialBalance: number) => {
    setAdding(true)
    const id = Math.random().toString(36).slice(2)
    await addAccount({
      id,
      name,
      initialBalance,
      createdAt: new Date().toISOString(),
    })
    setAdding(false)
    setModalVisible(false)
  }

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <AccountsHeader accounts={accounts} />

          {/* Content */}
          <View style={{ flex: 1 }}>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={{
                    fontSize: fontSizes.md,
                    color: colors.muted,
                    marginTop: spacing.md,
                  }}
                >
                  Carregando contas...
                </Text>
              </View>
            ) : (
              <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <AccountCard
                    item={item}
                    index={index}
                    onRemove={removeAccount}
                  />
                )}
                ListEmptyComponent={
                  <EmptyState
                    title="Nenhuma conta ainda"
                    message="Comece criando sua primeira conta para gerenciar suas finanças"
                    icon="wallet-outline"
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: spacing.sm,
                  paddingBottom: spacing.xl,
                  flexGrow: 1,
                }}
              />
            )}
          </View>

          {/* Add Button */}
          <View style={{ padding: spacing.lg }}>
            <AddButton onPress={handleOpenModal} />
          </View>

          <AddAccountModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onAdd={handleAddAccount}
            loading={adding}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}