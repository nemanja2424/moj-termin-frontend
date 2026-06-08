'use client';

import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

const LOCATION_PERMISSION_KEY = 'location_permission_status';
const LOCATION_DATA_KEY = 'user_location_data';

export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] = useState(null); // 'granted', 'denied', 'pending'
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detektuj platformu pri prvom učitavanju
  useEffect(() => {
    initializeLocationPermission();
  }, []);

  const isNativePlatform = () => {
    if (typeof window === 'undefined') return false;
    
    return (
      window.cordova !== undefined || 
      navigator.userAgent.includes('Android') ||
      navigator.userAgent.includes('iPhone') ||
      navigator.userAgent.includes('iPad') ||
      navigator.userAgent.includes('Capacitor')
    );
  };

  const isWebPlatform = () => {
    return !isNativePlatform();
  };

  // ============= STORAGE HELPERS =============
  const getPreference = async (key) => {
    if (isNativePlatform()) {
      try {
        const result = await Preferences.get({ key });
        return result.value || null;
      } catch (err) {
        console.error('Error getting Capacitor preference:', err);
        return null;
      }
    } else {
      // Web - koristi localStorage
      try {
        return localStorage.getItem(key) || null;
      } catch (err) {
        console.error('Error getting localStorage:', err);
        return null;
      }
    }
  };

  const setPreference = async (key, value) => {
    if (isNativePlatform()) {
      try {
        await Preferences.set({ key, value });
      } catch (err) {
        console.error('Error setting Capacitor preference:', err);
      }
    } else {
      // Web - koristi localStorage
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error('Error setting localStorage:', err);
      }
    }
  };

  const removePreference = async (key) => {
    if (isNativePlatform()) {
      try {
        await Preferences.remove({ key });
      } catch (err) {
        console.error('Error removing Capacitor preference:', err);
      }
    } else {
      // Web - koristi localStorage
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error('Error removing localStorage:', err);
      }
    }
  };

  // ============= INITIALIZATION =============
  const initializeLocationPermission = async () => {
    try {
      const status = await getPreference(LOCATION_PERMISSION_KEY);
      const locationJson = await getPreference(LOCATION_DATA_KEY);

      console.log('🔍 Initializing location permission...');
      console.log('📦 Stored status:', status);
      console.log('📍 Stored location:', locationJson);
      console.log('📱 Is native platform:', isNativePlatform());

      if (status) {
        setPermissionStatus(status);
      } else {
        setPermissionStatus('pending');
      }

      if (locationJson) {
        try {
          setLocationData(JSON.parse(locationJson));
        } catch (e) {
          console.error('Error parsing location data:', e);
          setLocationData(null);
        }
      }
    } catch (err) {
      console.error('Error initializing location permission:', err);
      setPermissionStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  // ============= WEB GEOLOCATION =============
  const requestPermissionWeb = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Tvoj pregledač ne podržava geolokaciju';
        console.error(errorMsg);
        setError(errorMsg);
        setPermissionStatus('denied');
        resolve({ success: false, reason: errorMsg });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;

            const location = {
              latitude,
              longitude,
              accuracy,
              timestamp: new Date().toISOString(),
            };

            // Čuva u localStorage
            await setPreference(LOCATION_PERMISSION_KEY, 'granted');
            await setPreference(LOCATION_DATA_KEY, JSON.stringify(location));

            setPermissionStatus('granted');
            setLocationData(location);

            resolve({ success: true, location });
          } catch (err) {
            console.error('Error saving location:', err);
            setError(err.message);
            resolve({ success: false, reason: err.message });
          }
        },
        (error) => {
          console.error('Error getting location (Web):', error);
          const errorMsg = error.message || 'Nije moguće pristupiti lokaciji';
          setError(errorMsg);

          // Čuva da je dozvola odbijena
          setPreference(LOCATION_PERMISSION_KEY, 'denied').catch(console.error);

          setPermissionStatus('denied');
          resolve({ success: false, reason: errorMsg });
        }
      );
    });
  };

  // ============= NATIVE GEOLOCATION =============
  const requestPermissionNative = async () => {
    try {
      // Prvo proverite status dozvole
      const status = await Geolocation.checkPermissions();

      let permissionGiven = false;
      if (status.location === 'denied' || status.location === 'prompt') {
        // Traži dozvolu
        const result = await Geolocation.requestPermissions();
        permissionGiven = result.location === 'granted';
      } else if (status.location === 'granted') {
        permissionGiven = true;
      }

      if (permissionGiven) {
        // Dobij lokaciju
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude, accuracy } = position.coords;

        const location = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        };

        // Čuva u Capacitor Preferences
        await setPreference(LOCATION_PERMISSION_KEY, 'granted');
        await setPreference(LOCATION_DATA_KEY, JSON.stringify(location));

        setPermissionStatus('granted');
        setLocationData(location);

        return { success: true, location };
      } else {
        // Korisnik je odbio dozvolu
        await setPreference(LOCATION_PERMISSION_KEY, 'denied');

        setPermissionStatus('denied');
        return { success: false, reason: 'Permission denied' };
      }
    } catch (err) {
      console.error('Error requesting location (Native):', err);
      setError(err.message);

      await setPreference(LOCATION_PERMISSION_KEY, 'denied');

      setPermissionStatus('denied');
      return { success: false, reason: err.message };
    }
  };

  // ============= PUBLIC METHODS =============
  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      if (isNativePlatform()) {
        console.log('Using NATIVE geolocation (Android/iOS)');
        result = await requestPermissionNative();
      } else {
        console.log('Using WEB geolocation (Browser)');
        result = await requestPermissionWeb();
      }

      return result;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setError(err.message);
      setPermissionStatus('denied');
      return { success: false, reason: err.message };
    } finally {
      setLoading(false);
    }
  };

  const denyPermission = async () => {
    try {
      await setPreference(LOCATION_PERMISSION_KEY, 'denied');
      setPermissionStatus('denied');
      return { success: true };
    } catch (err) {
      console.error('Error denying permission:', err);
      setError(err.message);
      setPermissionStatus('denied');
      return { success: false, reason: err.message };
    }
  };

  const clearLocationData = async () => {
    try {
      await removePreference(LOCATION_DATA_KEY);
      await removePreference(LOCATION_PERMISSION_KEY);

      setPermissionStatus('pending');
      setLocationData(null);
      return { success: true };
    } catch (err) {
      console.error('Error clearing location data:', err);
      setError(err.message);
      setPermissionStatus('pending');
      setLocationData(null);
      return { success: false, reason: err.message };
    }
  };

  const checkPermissionStatus = async () => {
    if (isNativePlatform()) {
      try {
        const result = await Geolocation.checkPermissions();
        return result.location;
      } catch (err) {
        console.error('Error checking permission status:', err);
        return 'denied';
      }
    }

    // Web platforme - nema mogućnosti da se proveri status unapred
    return 'prompt';
  };

  return {
    permissionStatus, // 'granted', 'denied', 'pending'
    locationData, // { latitude, longitude, accuracy, timestamp }
    loading,
    error,
    requestPermission,
    denyPermission,
    clearLocationData,
    checkPermissionStatus,
    isNativePlatform,
    isWebPlatform,
  };
}
