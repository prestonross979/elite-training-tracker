import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export type RootTab =
  | 'workout'
  | 'programs'
  | 'history'
  | 'weight'
  | 'coach'
  | 'settings';

type Props = {
  activeTab: RootTab;
  onChangeTab: (tab: RootTab) => void;
};

// Order drives the 3-column grid: items wrap after every 3, producing
// [Workout, Programs, History] / [Weight, Coach, Settings].
export const ROOT_TABS: RootTab[] = [
  'workout',
  'programs',
  'history',
  'weight',
  'coach',
  'settings',
];

export default function BottomTabs({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.grid}>
      {ROOT_TABS.map((tab) => {
        const active = activeTab === tab;

        return (
          <Pressable
            key={tab}
            style={[styles.tabItem, active && styles.tabItemActive]}
            onPress={() => onChangeTab(tab)}
          >
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 4,
  },
  tabItem: {
    width: '31%',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.accentText,
  },
});
