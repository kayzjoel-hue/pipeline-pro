import { ScrollView, Text, View, Pressable, Switch, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Settings Screen - User preferences and app configuration
 */
export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogin = () => {
    router.push("/login" as never);
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await logout();
      router.replace("/login" as never);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">Manage your preferences</Text>
          </View>

          {/* Notifications */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Notifications</Text>
            <SettingItem
              label="Follow-Up Reminders"
              description="Get notified about pending follow-ups"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {/* Appearance */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Appearance</Text>
            <SettingItem
              label="Dark Mode"
              description="Use dark theme"
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          </View>

          {/* Account */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">Account</Text>
            {authLoading ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" />
              </View>
            ) : (
              <View className="gap-3">
                <View className="pb-3 border-b border-border gap-1">
                  <Text className="text-sm text-muted">Signed in as</Text>
                  <Text className="text-base font-semibold text-foreground">
                    {user?.name || "Guest"}
                  </Text>
                  <Text className="text-sm text-muted">{user?.email || "No account connected"}</Text>
                </View>

                <Pressable
                  onPress={() => router.push("/(tabs)/edit-profile")}
                  className="py-3 border-b border-border active:opacity-80"
                >
                  <Text className="text-base text-foreground">Edit Profile</Text>
                </Pressable>

                <Pressable
                  onPress={() => router.push("/privacy" as never)}
                  className="py-3 border-b border-border active:opacity-80"
                >
                  <Text className="text-base text-foreground">Privacy Policy</Text>
                </Pressable>

                {user ? (
                  <Pressable
                    onPress={handleLogout}
                    disabled={signingOut}
                    className="py-3 active:opacity-80"
                  >
                    <Text className="text-base text-error">{signingOut ? "Logging out..." : "Logout"}</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleLogin}
                    disabled={signingOut}
                    className="py-3 active:opacity-80"
                  >
                    <Text className="text-base text-primary">Sign In</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* About */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">About</Text>
            <View className="py-2">
              <Text className="text-sm text-muted">Version</Text>
              <Text className="text-base text-foreground">1.0.0</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingItem({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-border last:border-b-0">
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{label}</Text>
        <Text className="text-xs text-muted mt-1">{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
