import { Text, View } from 'react-native'

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Settings</Text>
      <Text style={{ marginTop: 16 }}>Configurações gerais do app.</Text>
    </View>
  )
}
