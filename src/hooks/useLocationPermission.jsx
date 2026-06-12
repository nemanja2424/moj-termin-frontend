'use client';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

const LOCATION_PERMISSION_KEY = 'location_permission_status';
const LOCATION_DATA_KEY = 'user_location_data';
const LOCATION_DISMISSED_KEY = 'location_permission_dismissed';

export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeLocationPermission();
  }, []);

  const isNativePlatform = () => {
    if (typeof window === 'undefined') return false;
    return Capacitor.isNativePlatform();
  };

  const isWebPlatform = () => {
    return !isNativePlatform();
  };

  const getPreference = async (key) => {
    if (isNativePlatform()) {
      try {
        const result = await Preferences.get({ key });
        return result.value || null;
      } catch (err) {
        console.error('Error getting Capacitor preference:', err);
        return null;
      }
    }

    try {
      return localStorage.getItem(key) || null;
    } catch (err) {
      console.error('Error getting localStorage:', err);
      return null;
    }
  };

  const setPreference = async (key, value) => {
    if (isNativePlatform()) {
      try {
        await Preferences.set({ key, value });
      } catch (err) {
        console.error('Error setting Capacitor preference:', err);
      }
      return;
    }

    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('Error setting localStorage:', err);
    }
  };

  const removePreference = async (key) => {
    if (isNativePlatform()) {
      try {
        await Preferences.remove({ key });
      } catch (err) {
        console.error('Error removing Capacitor preference:', err);
      }
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Error removing localStorage:', err);
    }
  };

  const initializeLocationPermission = async () => {
    try {
      const savedStatus = await getPreference(LOCATION_PERMISSION_KEY);
      const dismissed = await getPreference(LOCATION_DISMISSED_KEY);
      const locationJson = await getPreference(LOCATION_DATA_KEY);

      if (locationJson) {
        try {
          setLocationData(JSON.parse(locationJson));
        } catch (err) {
          console.error('Error parsing location data:', err);
          setLocationData(null);
        }
      }

      if (isNativePlatform()) {
        const nativeStatus = await checkPermissionStatus();

        if (nativeStatus === 'granted') {
          setPermissionStatus('granted');
          await setPreference(LOCATION_PERMISSION_KEY, 'granted');
          await removePreference(LOCATION_DISMISSED_KEY);
          return;
        }

        if (nativeStatus === 'prompt' || nativeStatus === 'prompt-with-rationale') {
          if (dismissed === 'true') {
            setPermissionStatus('denied');
            return;
          }

          if (savedStatus === 'denied') {
            await removePreference(LOCATION_PERMISSION_KEY);
          }

          setPermissionStatus('pending');
          return;
        }

        if (dismissed === 'true') {
          setPermissionStatus('denied');
          await setPreference(LOCATION_PERMISSION_KEY, 'denied');
          return;
        }

        setPermissionStatus('pending');
        return;
      }

      setPermissionStatus(savedStatus || 'pending');
    } catch (err) {
      console.error('Error initializing location permission:', err);
      setPermissionStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  const requestPermissionWeb = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Tvoj pregledac ne podrzava geolokaciju';
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

            await setPreference(LOCATION_PERMISSION_KEY, 'granted');
            await setPreference(LOCATION_DATA_KEY, JSON.stringify(location));
            await removePreference(LOCATION_DISMISSED_KEY);

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
          const errorMsg = error.message || 'Nije moguce pristupiti lokaciji';
          setError(errorMsg);
          setPreference(LOCATION_PERMISSION_KEY, 'denied').catch(console.error);
          setPermissionStatus('denied');
          resolve({ success: false, reason: errorMsg });
        }
      );
    });
  };

  const requestPermissionNative = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      let permissionGiven = false;

      if (
        status.location === 'denied' ||
        status.location === 'prompt' ||
        status.location === 'prompt-with-rationale'
      ) {
        const result = await Geolocation.requestPermissions();
        permissionGiven = result.location === 'granted';
      } else if (status.location === 'granted') {
        permissionGiven = true;
      }

      if (permissionGiven) {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude, accuracy } = position.coords;
        const location = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        };

        await setPreference(LOCATION_PERMISSION_KEY, 'granted');
        await setPreference(LOCATION_DATA_KEY, JSON.stringify(location));
        await removePreference(LOCATION_DISMISSED_KEY);

        setPermissionStatus('granted');
        setLocationData(location);

        return { success: true, location };
      }

      await setPreference(LOCATION_PERMISSION_KEY, 'denied');
      setPermissionStatus('denied');
      return { success: false, reason: 'Permission denied' };
    } catch (err) {
      console.error('Error requesting location (Native):', err);
      setError(err.message);
      await setPreference(LOCATION_PERMISSION_KEY, 'denied');
      setPermissionStatus('denied');
      return { success: false, reason: err.message };
    }
  };

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isNativePlatform()) {
        return await requestPermissionNative();
      }

      return await requestPermissionWeb();
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
      await setPreference(LOCATION_DISMISSED_KEY, 'true');
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
      await removePreference(LOCATION_DISMISSED_KEY);

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

    return 'prompt';
  };

  return {
    permissionStatus,
    locationData,
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
