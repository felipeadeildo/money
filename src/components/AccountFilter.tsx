import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, fontSizes, spacing } from '../theme'
import { Account } from '../types/types'

type AccountFilterProps = {
  accounts: Account[]
  selectedAccount?: string
  onSelectAccount: (accountId?: string) => void
}

export function AccountFilter({ accounts, selectedAccount, onSelectAccount }: AccountFilterProps) {
  const filterData = [{ id: undefined, name: 'Todas' }, ...accounts]

  const renderFilterItem = ({ item }: { item: { id?: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.filterBtn,
        selectedAccount === item.id && styles.filterBtnActive,
      ]}
      onPress={() => onSelectAccount(item.id)}
      activeOpacity={0.7}
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
  )

  return (
    <FlatList
      data={filterData}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id || 'all'}
      renderItem={renderFilterItem}
      contentContainerStyle={styles.container}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  list: {
    marginBottom: spacing.xs,
    height: 32,
  },
  filterBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 28,
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fontSizes.xs,
  },
  filterBtnTextActive: {
    color: colors.white,
  },
})