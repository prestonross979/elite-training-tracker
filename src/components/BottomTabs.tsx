import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RootTab = 'workout' | 'weight' | 'coach' | 'settings';

type Props = {
  activeTab: RootTab;
  onChangeTab: (tab: RootTab) => void;
};

const tabs: RootTab[] = ['workout', 'history', 'weight', 'coach', 'settings'];

export default function BottomTabs({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.nav}>
      {tabs.map((tab) => {
        const active = activeTab === tab;
        return (
          <Pressable
            key={tab}
            style={[styles.navItem, active && styles.navItemActive]}
            onPress={() => onChangeTab(tab)}
          >
            <Text style={[styles.navText, active && styles.navTextActive]}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', gap: 8, marginTop: 12 },
  navItem: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  navItemActive: { backgroundColor: 'white' },
  navText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  navTextActive: { color: '#09090b' },
});