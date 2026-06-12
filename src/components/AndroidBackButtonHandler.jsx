"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export default function AndroidBackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeDepthRef = useRef(0);
  const currentLocation = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    routeDepthRef.current += 1;
  }, [currentLocation]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return undefined;
    }

    let backButtonListener;

    const setupBackButton = async () => {
      backButtonListener = await App.addListener("backButton", ({ canGoBack }) => {
        const hasRouteHistory = routeDepthRef.current > 1;

        if (canGoBack || hasRouteHistory) {
          routeDepthRef.current = Math.max(0, routeDepthRef.current - 1);
          router.back();
          return;
        }

        App.minimizeApp();
      });
    };

    setupBackButton();

    return () => {
      backButtonListener?.remove?.();
    };
  }, [router]);

  return null;
}
