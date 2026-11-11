import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, ui } from '../theme';
export default function Dialog({ title, subtitle, onClose, children }) {
  return <Modal transparent visible animationType="fade" onRequestClose={onClose}>
    <SafeAreaView style={styles.backdrop}>
      <KeyboardAvoidingView style={styles.center} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View accessibilityViewIsModal style={styles.sheet}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 22 }}>
            <Text accessibilityRole="header" style={[ui.title, { fontSize: 24 }]}>{title}</Text>
            <Text style={[ui.subtitle, { marginTop: 6, marginBottom: 22 }]}>{subtitle}</Text>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#102A38A8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  sheet: { width: '100%', maxWidth: 520, maxHeight: '100%', backgroundColor: colors.surface, borderRadius: 24, overflow: 'hidden' },
});
