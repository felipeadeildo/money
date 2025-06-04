import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontSizes, spacing } from '../theme';

type CustomInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoFocus?: boolean;
};

export function CustomInput({
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  keyboardType = 'default',
  autoFocus = false,
}: CustomInputProps) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? colors.danger : colors.border },
        ]}
      >
        <LinearGradient
          colors={['rgba(37, 99, 235, 0.1)', 'rgba(59, 130, 246, 0.05)']}
          style={styles.inputIcon}
        >
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </LinearGradient>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          selectionColor={colors.primary}
        />
      </View>

      {error ? (
        <Animated.View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    paddingVertical: spacing.md + 2,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.danger,
    fontWeight: '500',
  },
});