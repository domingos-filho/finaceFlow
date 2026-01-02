import React, { useContext, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';

export const LoginScreen = () => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>FinaceFlow</Text>
      <TextInput placeholder="Email" autoCapitalize="none" style={styles.input} onChangeText={setEmail} value={email} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} onChangeText={setPassword} value={password} />
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleSubmit} disabled={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8 },
});
