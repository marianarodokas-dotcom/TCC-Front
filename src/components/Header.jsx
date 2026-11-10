import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { COLORS } from '../constants/theme';

const LOGO_IMG = require('../../assets/images/NatureFoundationCropped.png');

export function Header({ onBack, onLogout }) {
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(Math.max(width * 0.48, 230), 430);

  return (
    <View style={styles.outer}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.side}>
            {onBack ? (
              <TouchableOpacity onPress={onBack} style={styles.action} accessibilityLabel="Voltar">
                <Text style={styles.actionText}>‹</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Image source={LOGO_IMG} style={[styles.logo, { width: logoWidth }]} contentFit="contain" />

          <View style={[styles.side, styles.right]}>
            {onLogout ? (
              <TouchableOpacity onPress={onLogout} style={styles.action} accessibilityLabel="Sair">
                <Text style={styles.actionText}>SAIR</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { backgroundColor: COLORS.green, width: '100%' },
  safe: { backgroundColor: COLORS.green },
  content: {
    minHeight: 92,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { width: 64, alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  logo: { height: 62 },
  border: { height: 3, backgroundColor: COLORS.cream },
  action: { paddingHorizontal: 6, paddingVertical: 8 },
  actionText: { color: COLORS.cream, fontWeight: '900', fontSize: 12 },
});

export default Header;
