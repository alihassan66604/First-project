import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { AuthScreen } from './src/screens/AuthScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { KeywordsScreen } from './src/screens/KeywordsScreen';
import { ClustersScreen } from './src/screens/ClustersScreen';
import { ArticleScreen } from './src/screens/ArticleScreen';
import { CoverageScreen } from './src/screens/CoverageScreen';
import { EtsyToolkitScreen } from './src/screens/EtsyToolkitScreen';
import { BlogToolkitScreen } from './src/screens/BlogToolkitScreen';
import { CheckerScreen } from './src/screens/CheckerScreen';
import { IdeasScreen } from './src/screens/IdeasScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { AssistantScreen } from './src/screens/AssistantScreen';
import { ExportScreen } from './src/screens/ExportScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TabBar } from './src/components/TabBar';
import { UserSession, TabType } from './src/types';

const ALL_TOOLS: { id: TabType; title: string; subtitle: string; icon: string }[] = [
  { id: 'dashboard', title: 'User Dashboard', subtitle: 'Overview & metrics', icon: '🏠' },
  { id: 'keywords', title: '5,000 Keywords', subtitle: 'Google & Etsy Autocomplete', icon: '🔍' },
  { id: 'clusters', title: '25 Keyword Groups', subtitle: 'Semantic topic clusters', icon: '🗂️' },
  { id: 'article', title: 'Article Builder', subtitle: 'H1, H2, H3 outlines', icon: '📄' },
  { id: 'coverage', title: 'Content Coverage', subtitle: 'Keyword coverage score', icon: '🎯' },
  { id: 'etsy', title: 'Etsy 13 Tags QA', subtitle: '140 chars & 13 tags check', icon: '🛍️' },
  { id: 'blog', title: 'Blog SEO Toolkit', subtitle: 'Clean slug & meta description', icon: '✍️' },
  { id: 'checker', title: 'SEO Checker', subtitle: 'Listing audit & trademarks', icon: '🔎' },
  { id: 'ideas', title: '100+ Product Ideas', subtitle: 'High demand blueprints', icon: '💡' },
  { id: 'projects', title: 'Saved Projects', subtitle: 'Campaign folders', icon: '📁' },
  { id: 'assistant', title: 'AI Assistant', subtitle: 'Instant chat answers', icon: '🤖' },
  { id: 'export', title: 'Export Center', subtitle: 'CSV & JSON downloads', icon: '📤' },
  { id: 'profile', title: 'My Account', subtitle: 'Settings & account info', icon: '👤' },
];

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [menuVisible, setMenuVisible] = useState(false);

  // If not logged in, show Auth Screen (Sign In & Sign Up)
  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <AuthScreen onLoginSuccess={(sess) => setSession(sess)} />
      </SafeAreaView>
    );
  }

  // Active Screen Renderer
  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen session={session} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'keywords':
        return <KeywordsScreen />;
      case 'clusters':
        return <ClustersScreen />;
      case 'article':
        return <ArticleScreen />;
      case 'coverage':
        return <CoverageScreen />;
      case 'etsy':
        return <EtsyToolkitScreen />;
      case 'blog':
        return <BlogToolkitScreen />;
      case 'checker':
        return <CheckerScreen />;
      case 'ideas':
        return <IdeasScreen />;
      case 'projects':
        return <ProjectsScreen />;
      case 'assistant':
        return <AssistantScreen />;
      case 'export':
        return <ExportScreen />;
      case 'profile':
        return (
          <ProfileScreen
            session={session}
            onLogout={() => {
              setSession(null);
              setActiveTab('dashboard');
            }}
          />
        );
      default:
        return <DashboardScreen session={session} onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const currentTool = ALL_TOOLS.find((t) => t.id === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* TOP MOBILE BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.menuBtnIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.topBarTitleBox}>
            <Text style={styles.topBarTitle}>{currentTool?.title || 'SEO Pilot'}</Text>
            <Text style={styles.topBarShop}>{session.shopName || session.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              setSession(null);
              setActiveTab('dashboard');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE SCREEN CONTENT */}
        <View style={styles.screenContainer}>{renderScreen()}</View>

        {/* BOTTOM TAB BAR */}
        <TabBar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onOpenMenu={() => setMenuVisible(true)}
        />

        {/* ALL 12 TOOLS MODAL DRAWER */}
        <Modal
          visible={menuVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>All 12 Client SEO Tools</Text>
                  <Text style={styles.modalSubtitle}>SEO Pilot Mobile Suite</Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setMenuVisible(false)}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* User Profile Info in Menu */}
              <View style={styles.userBanner}>
                <View style={styles.userInitialBox}>
                  <Text style={styles.userInitial}>
                    {(session.name || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{session.name}</Text>
                  <Text style={styles.userEmail}>{session.email}</Text>
                </View>
              </View>

              {/* Tools List */}
              <ScrollView style={styles.toolsScroll} contentContainerStyle={styles.toolsGrid}>
                {ALL_TOOLS.map((tool) => {
                  const isCurrent = activeTab === tool.id;
                  return (
                    <TouchableOpacity
                      key={tool.id}
                      style={[styles.toolCard, isCurrent && styles.toolCardActive]}
                      onPress={() => {
                        setActiveTab(tool.id);
                        setMenuVisible(false);
                      }}
                    >
                      <Text style={styles.toolIcon}>{tool.icon}</Text>
                      <Text style={[styles.toolTitle, isCurrent && styles.toolTitleActive]}>
                        {tool.title}
                      </Text>
                      <Text style={styles.toolSub}>{tool.subtitle}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBar: {
    height: 52,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtnIcon: {
    fontSize: 16,
    fontWeight: '900',
    color: '#334155',
  },
  topBarTitleBox: {
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  topBarShop: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4f46e5',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    padding: 10,
    borderRadius: 12,
    marginVertical: 12,
    gap: 10,
  },
  userInitialBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
  userName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e1b4b',
  },
  userEmail: {
    fontSize: 10,
    color: '#6366f1',
  },
  toolsScroll: {
    maxHeight: 460,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toolCardActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  toolTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  toolTitleActive: {
    color: '#4338ca',
  },
  toolSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
});
