import { Platform } from 'react-native';

/**
 * Backend API Configuration
 * - Local Wi-Fi IP for physical Android/iOS devices running Expo Go
 * - Localhost fallback for web and Android emulator (10.0.2.2)
 */
export const LOCAL_DEV_IP = '192.168.1.71';
export const BACKEND_PORT = 5001;

export const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return `http://localhost:${BACKEND_PORT}/api`;
  }
  // Physical device on local Wi-Fi network:
  return `http://${LOCAL_DEV_IP}:${BACKEND_PORT}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
