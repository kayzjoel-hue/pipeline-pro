import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Name required", "Enter your name to continue.");
      return;
    }

    try {
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signIn({
        name: trimmedName,
        email: email.trim() || undefined,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Sign In", error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="bg-gradient-to-b from-blue-50 to-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0f766e" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-gradient-to-b from-blue-50 to-white">
      <View className="flex-1 px-6 py-10 justify-center">
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 gap-6 self-center w-full max-w-[560px]">
          <View className="items-center gap-3">
            <View className="w-20 h-20 bg-teal-600 rounded-full items-center justify-center shadow-lg">
              <Text className="text-4xl">💼</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center">Sign in to get started</Text>
            <Text className="text-base text-gray-600 leading-7 text-center">
              Enter your name and keep moving. Everything stays local and under your control.
            </Text>
          </View>

          <View className="gap-4">
            <InputField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={saving}
            className="bg-[#17324d] rounded-2xl py-4 items-center active:opacity-80 shadow-sm"
          >
            <Text className="text-white font-semibold text-lg">
              {saving ? "Signing in..." : "Get Started"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="border border-gray-300 rounded-2xl py-4 items-center active:opacity-80"
          >
            <Text className="text-gray-600 font-semibold text-lg">Go Back</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-gray-900">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        className="border border-gray-300 rounded-2xl px-4 py-3 bg-white text-gray-900"
      />
    </View>
  );
}
