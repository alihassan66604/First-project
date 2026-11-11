import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export function AssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '👋 Assalam-o-Alaikum! Main aapka SEO AI Assistant hoon. Kisi bhi product ke title, 13 tags ya Google & Etsy SEO strategy ke baare mein poochein.',
    },
  ]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: q };
    const reply: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: `Aap ke keyword "${q}" ke liye SEO tajweez:\n• 13 Recommended Tags: ${q} gift, handmade ${q}, genuine ${q}, custom ${q}, anniversary ${q}, personalized ${q}, vintage ${q}.\n• Reminder: 140 characters limit aur 13 tags rule ka khayal rakhein!`,
    };

    setMessages((prev) => [...prev, userMsg, reply]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 SEO AI Assistant</Text>
        <Text style={styles.subtitle}>Instant SEO advice &amp; listing generation on phone</Text>
      </View>

      <ScrollView style={styles.chatBox} contentContainerStyle={styles.chatContent}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.msgWrapper, m.sender === 'user' ? styles.msgRight : styles.msgLeft]}
          >
            <View style={[styles.msgBubble, m.sender === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.msgText, m.sender === 'user' ? styles.userText : styles.botText]}>
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything (e.g. leather wallet, tags)..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, paddingBottom: 8, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  chatBox: { flex: 1 },
  chatContent: { padding: 14, gap: 10 },
  msgWrapper: { flexDirection: 'row' },
  msgRight: { justifyContent: 'flex-end' },
  msgLeft: { justifyContent: 'flex-start' },
  msgBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
  },
  userBubble: { backgroundColor: '#4f46e5' },
  botBubble: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0' },
  msgText: { fontSize: 12, lineHeight: 18 },
  userText: { color: '#ffffff', fontWeight: '600' },
  botText: { color: '#1e293b' },
  inputArea: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    height: 40,
  },
  sendBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
});
