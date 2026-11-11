import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

interface Project {
  id: string;
  name: string;
  kwCount: number;
  date: string;
  status: 'Active' | 'Archived';
}

export function ProjectsScreen() {
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: "Etsy Father's Day 2026 Campaign", kwCount: 42, date: '2 hours ago', status: 'Active' },
    { id: '2', name: 'Minimalist Leather Wallets Collection', kwCount: 100, date: 'Yesterday', status: 'Active' },
    { id: '3', name: 'Digital Wedding Stationery Bundle', kwCount: 65, date: '3 days ago', status: 'Active' },
  ]);

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      kwCount: 0,
      date: 'Just now',
      status: 'Active',
    };
    setProjects([newProj, ...projects]);
    setNewProjectName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📁 Saved Projects</Text>
        <Text style={styles.subtitle}>Organize your keywords and listing campaigns</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Create New Project Folder</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newProjectName}
            onChangeText={setNewProjectName}
            placeholder="e.g. Canva Templates Spring 2026..."
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddProject}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Workspace Projects ({projects.length})</Text>
      <View style={styles.list}>
        {projects.map((p) => (
          <View key={p.id} style={styles.projectItem}>
            <View>
              <Text style={styles.projectName}>{p.name}</Text>
              <Text style={styles.projectMeta}>
                {p.kwCount} keywords &bull; {p.date}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{p.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  label: { fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 6 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    height: 40,
  },
  addBtn: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  list: { gap: 8 },
  projectItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  projectMeta: { fontSize: 10, color: '#64748b', marginTop: 2 },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: { fontSize: 9, fontWeight: '700', color: '#15803d' },
});
