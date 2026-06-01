import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "#22c55e", text: "#ffffff" },
  error: { bg: "#ef4444", text: "#ffffff" },
  info: { bg: "#0a7ea4", text: "#ffffff" },
};

export function Toast({
  message,
  type,
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDismiss?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, onDismiss]);

  const toastColor = TOAST_COLORS[type];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: toastColor.bg,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={{ color: toastColor.text, fontSize: 18, fontWeight: "bold" }}>
          {TOAST_ICONS[type]}
        </Text>
        <Text
          style={{
            color: toastColor.text,
            fontSize: 14,
            fontWeight: "500",
            flex: 1,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: ToastType }[]
  >([]);

  const showToast = (message: string, type: ToastType = "info", duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration + 300);
  };

  const success = (message: string) => showToast(message, "success");
  const error = (message: string) => showToast(message, "error");
  const info = (message: string) => showToast(message, "info");

  return {
    showToast,
    success,
    error,
    info,
    toasts,
  };
}
