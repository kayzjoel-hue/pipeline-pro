import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser({
        name: name.trim().length > 0 ? name.trim() : undefined,
        email: email.trim().length > 0 ? email.trim() : undefined,
      });
      Alert.alert("Saved", "Your profile has been updated.");
      router.back();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!user) {
    return (
      <ScreenContainer className="flex-1 p-6 bg-background">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-bold text-foreground text-center">Sign in first</Text>
          <Text className="text-sm text-muted text-center">
            You need an account session before you can edit profile details.
          </Text>
          <Pressable
            onPress={() => router.push("/login" as never)}
            className="bg-primary rounded-xl py-3 px-4 active:opacity-80"
          >
            <Text className="text-background font-semibold">Sign In</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Edit Profile</Text>
            <Text className="text-sm text-muted">Update the account details shown in the app</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Display Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#687076"
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#687076"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
              />
            </View>

            <View className="gap-2 pt-2">
              <Text className="text-xs text-muted">Login method</Text>
              <Text className="text-sm text-foreground">{user.loginMethod || "Unknown"}</Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => router.back()}
              disabled={saving}
              className="flex-1 border border-border rounded-xl py-3 px-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="flex-1 bg-primary rounded-xl py-3 px-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">
                {saving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
