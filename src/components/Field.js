import { Text, TextInput, View } from 'react-native';
import { colors, ui } from '../theme';
export default function Field({ label, error = '', ...props }) {
  return <View style={{ marginBottom: 16 }}>
    <Text style={ui.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor={colors.muted}
      style={[ui.input, error ? { borderColor: colors.red } : null]} {...props} />
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
  </View>;
}
