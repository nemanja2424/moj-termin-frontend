"use client";
import { useState, useEffect } from 'react';

function useAuthXano() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await fetch('https://mojtermin.site/api/auth/provera', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error while checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); 

  return isAuthenticated;
}

export default useAuthXano;
