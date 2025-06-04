import { Text, View } from 'react-native'

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Dashboard</Text>
      <Text style={{ marginTop: 16 }}>
        Overview das contas, gastos e filtros aqui.
      </Text>
    </View>
  )
}
