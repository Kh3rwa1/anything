import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { PropsWithChildren, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { create } from 'zustand';

export type AppThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'ias-academy-theme-mode';

let activeMode: AppThemeMode = 'dark';
let preprocessorsInstalled = false;

const SURFACE_LIGHT_MAP: Record<string, string> = {
  '#0A0A0F': '#F8FAFC',
  '#111118': '#FFFFFF',
  '#1A1A2E': '#FFFFFF',
  '#2D2D4E': '#E2E8F0',
  '#1E1B4B': '#EEF2FF',
  '#2D1A00': '#FFF7ED',
  '#022C22': '#ECFDF5',
  '#0C1A29': '#EFF6FF',
  '#1E0B3A': '#F5F3FF',
  '#2D0A0A': '#FEF2F2',
  '#1A0A0A': '#FEF2F2',
};

const TEXT_LIGHT_MAP: Record<string, string> = {
  '#F1F5F9': '#0F172A',
  '#E2E8F0': '#1E293B',
  '#CBD5E1': '#334155',
  '#94A3B8': '#64748B',
  '#818CF8': '#4F46E5',
  '#C4B5FD': '#6D28D9',
  '#6366F1': '#4F46E5',
  '#4B5563': '#64748B',
  '#374151': '#94A3B8',
  '#1F2937': '#CBD5E1',
  '#1E1E2E': '#CBD5E1',
};

const BORDER_LIGHT_MAP: Record<string, string> = {
  ...SURFACE_LIGHT_MAP,
  '#2D2D4E': '#E2E8F0',
  '#1A1A2E': '#E5E7EB',
  '#111118': '#E5E7EB',
  '#0A0A0F': '#E5E7EB',
};

const BACKGROUND_STYLE_PROPS = new Set([
  'backgroundColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
]);

const LIGHT_PALETTE = {
  mode: 'light' as const,
  isLight: true,
  isDark: false,
  screen: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textSoft: '#475569',
  textMuted: '#64748B',
  primary: '#4F46E5',
  accent: '#F59E0B',
  tabBar: '#FFFFFF',
  tabBorder: '#E2E8F0',
  tabInactive: '#94A3B8',
  statusBar: 'dark' as const,
};

const DARK_PALETTE = {
  mode: 'dark' as const,
  isLight: false,
  isDark: true,
  screen: '#0A0A0F',
  surface: '#1A1A2E',
  surfaceMuted: '#111118',
  border: '#2D2D4E',
  text: '#F1F5F9',
  textSoft: '#E2E8F0',
  textMuted: '#4B5563',
  primary: '#818CF8',
  accent: '#F59E0B',
  tabBar: '#111118',
  tabBorder: '#1E1E2E',
  tabInactive: '#374151',
  statusBar: 'light' as const,
};

type AppThemeState = {
  mode: AppThemeMode;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setMode: (mode: AppThemeMode) => void;
  toggleMode: () => void;
};

function normalizeColor(value: string) {
  return value.trim().toUpperCase();
}

function remapColor(value: unknown, map: Record<string, string>) {
  if (activeMode !== 'light' || typeof value !== 'string') return value;
  const normalized = normalizeColor(value);
  return map[normalized] ?? value;
}

function remapStyleValue(prop: string, value: unknown) {
  if (prop === 'color') return remapColor(value, TEXT_LIGHT_MAP);
  if (prop === 'borderColor') return remapColor(value, BORDER_LIGHT_MAP);
  if (BACKGROUND_STYLE_PROPS.has(prop)) return remapColor(value, SURFACE_LIGHT_MAP);
  return value;
}

export function themeStyle<T>(style: T): T {
  if (activeMode !== 'light' || style == null) return style;
  if (Array.isArray(style)) return style.map((item) => themeStyle(item)) as T;
  if (typeof style !== 'object') return style;

  const next: Record<string, unknown> = {};
  Object.entries(style as Record<string, unknown>).forEach(([key, value]) => {
    next[key] = remapStyleValue(key, value);
  });
  return next as T;
}

function installThemePreprocessors() {
  if (preprocessorsInstalled || !StyleSheet.setStyleAttributePreprocessor) return;
  preprocessorsInstalled = true;

  const backgroundProps = [
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ];
  backgroundProps.forEach((prop) => {
    StyleSheet.setStyleAttributePreprocessor(prop, (value) => remapColor(value, SURFACE_LIGHT_MAP));
  });
  StyleSheet.setStyleAttributePreprocessor('borderColor', (value) =>
    remapColor(value, BORDER_LIGHT_MAP)
  );
  StyleSheet.setStyleAttributePreprocessor('color', (value) => remapColor(value, TEXT_LIGHT_MAP));
}

installThemePreprocessors();

export const useThemeStore = create<AppThemeState>((set, get) => ({
  mode: 'dark',
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) return;
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const mode: AppThemeMode = saved === 'light' ? 'light' : 'dark';
      activeMode = mode;
      set({ mode, hydrated: true });
    } catch {
      activeMode = 'dark';
      set({ mode: 'dark', hydrated: true });
    }
  },
  setMode: (mode) => {
    activeMode = mode;
    set({ mode, hydrated: true });
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  },
  toggleMode: () => {
    get().setMode(get().mode === 'light' ? 'dark' : 'light');
  },
}));

export function useAppTheme() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const palette = mode === 'light' ? LIGHT_PALETTE : DARK_PALETTE;

  activeMode = mode;

  return {
    ...palette,
    setMode,
    toggleMode,
  };
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const mode = useThemeStore((s) => s.mode);
  const hydrate = useThemeStore((s) => s.hydrate);

  activeMode = mode;

  useEffect(() => {
    installThemePreprocessors();
    void hydrate();
  }, [hydrate]);

  // Remount route content on mode changes so inline RN styles are regenerated
  // after the color preprocessor switches token maps.
  return <React.Fragment key={`${mode}-${Platform.OS}`}>{children}</React.Fragment>;
}
