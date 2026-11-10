import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { Header } from '../components/Header';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CENTER_LOGO = require('../../assets/images/logoCompleta.png');

const SLIDES = [
  { id: '1', image: require('../../assets/images/carrossel1.jpg') },
  { id: '2', image: require('../../assets/images/carrossel2.jpg') },
  { id: '3', image: require('../../assets/images/carrossel3.jpg') },
];

export function LandingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.loginBar}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>ENTRAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoSection}>
          <Image source={CENTER_LOGO} style={styles.logoImage} contentFit="contain" />
        </View>

        <View style={styles.divider} />

        <View style={styles.carouselContainer}>
          <View style={styles.slide}>
            <Image source={SLIDES[activeIndex].image} style={styles.carouselImage} contentFit="cover" />

            <TouchableOpacity style={[styles.carouselArrow, styles.leftArrow]} onPress={previousSlide} accessibilityLabel="Imagem anterior">
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.carouselArrow, styles.rightArrow]} onPress={nextSlide} accessibilityLabel="Próxima imagem">
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paginationContainer}>
            {SLIDES.map((slide, index) => (
              <TouchableOpacity
                key={slide.id}
                style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
                onPress={() => setActiveIndex(index)}
                accessibilityLabel={`Ir para imagem ${index + 1}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>FIRE GUARD</Text>
          <View style={styles.innerDivider} />
          <Text style={styles.infoText}>
            A preservação dos recursos naturais exige inteligência, rigor e pronta resposta.
            Movida por engenharia de alta precisão, nossa tecnologia utiliza sensores térmicos
            avançados para identificar e conter focos de incêndio no instante de sua formação,
            neutralizando riscos antes da propagação. Inovação robusta a serviço da integridade
            dos ecossistemas e do patrimônio ambiental.
          </Text>
          <Text style={styles.flameIcon}>🔥</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>@FIRE_GUARD</Text>
          <Text style={styles.footerText}>FIREGUARD@GMAIL.COM</Text>
          <Text style={styles.footerText}>(14)9999-99999</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.green },
  container: { backgroundColor: COLORS.cream, alignItems: 'center' },
  loginBar: { width: '100%', backgroundColor: COLORS.terracotta, paddingVertical: 8, paddingHorizontal: 20, alignItems: 'flex-end' },
  loginButton: { paddingHorizontal: 10 },
  loginText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
  logoSection: { width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  logoImage: { width: Math.min(SCREEN_WIDTH * 0.8, 350), height: 190 },
  divider: { width: '92%', height: 2, backgroundColor: '#C5B390', marginVertical: 10 },
  carouselContainer: { width: '100%', maxWidth: 700, alignItems: 'center', marginVertical: 10 },
  slide: { width: Math.min(SCREEN_WIDTH, 700), height: 260, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, position: 'relative' },
  carouselImage: { width: '100%', height: '100%', borderRadius: 8 },
  carouselArrow: { position: 'absolute', top: '42%', width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.48)', alignItems: 'center', justifyContent: 'center' },
  leftArrow: { left: 28 },
  rightArrow: { right: 28 },
  arrowText: { color: COLORS.white, fontSize: 34, lineHeight: 36, fontWeight: '300' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  activeDot: { width: 24, backgroundColor: COLORS.green },
  inactiveDot: { width: 8, backgroundColor: '#C5B390' },
  infoSection: { width: '100%', backgroundColor: COLORS.green, padding: 25, alignItems: 'center', marginTop: 10 },
  infoTitle: { color: COLORS.white, fontSize: 22, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10, fontFamily: 'serif' },
  innerDivider: { width: '80%', height: 1, backgroundColor: COLORS.white, marginBottom: 20 },
  infoText: { color: COLORS.white, fontSize: 13, textAlign: 'center', lineHeight: 20, fontWeight: '500', maxWidth: 700 },
  flameIcon: { fontSize: 26, marginTop: 20 },
  footer: { width: '100%', backgroundColor: COLORS.green, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 5 },
  footerText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
});

export default LandingScreen;
