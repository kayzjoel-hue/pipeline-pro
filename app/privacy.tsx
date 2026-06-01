import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "Job application details you choose to enter.",
      "Optional profile details used for local sign-in.",
      "No advertising identifiers or marketing profiles.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "To track job applications.",
      "To manage follow-ups and reminders.",
      "To show dashboard summaries and local analytics.",
    ],
  },
  {
    title: "Storage",
    body: [
      "Your data stays on your device.",
      "We do not sync your data to a cloud account by default.",
      "Deleting the app or clearing storage may remove local data.",
    ],
  },
  {
    title: "Sharing",
    body: [
      "We do not sell your personal information.",
      "We do not share your job search data with advertisers.",
      "We only rely on system services when you choose app features like notifications.",
    ],
  },
  {
    title: "Children’s Privacy",
    body: ["Pipeline Pro is not intended for children under 13."],
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-5 pb-10"
      >
        <View className="py-6 gap-6 self-center w-full max-w-[820px]">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border active:opacity-80"
            >
              <MaterialCommunityIcons name="chevron-left" size={20} color="#17324d" />
              <Text className="text-base font-semibold text-foreground">Back</Text>
            </Pressable>

            <View className="px-3 py-2 rounded-full bg-teal-50 border border-teal-100">
              <Text className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
                Privacy Policy
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl border border-border p-6 shadow-sm gap-5">
            <View className="items-center gap-3">
              <View className="w-16 h-16 rounded-full bg-teal-600 items-center justify-center">
                <MaterialCommunityIcons name="shield-check" size={30} color="white" />
              </View>
              <Text className="text-3xl font-bold text-foreground text-center">
                Pipeline Pro Privacy Policy
              </Text>
              <Text className="text-sm text-muted text-center max-w-[640px] leading-6">
                Effective Date: May 28, 2026
              </Text>
            </View>

            <Text className="text-base text-foreground leading-7">
              Pipeline Pro is designed to keep your job search organized while respecting your privacy.
              This policy explains what we collect, how we use it, and how your data is stored.
            </Text>
          </View>

          {sections.map((section) => (
            <View key={section.title} className="bg-surface rounded-3xl border border-border p-5 gap-3 shadow-sm">
              <Text className="text-xl font-bold text-foreground">{section.title}</Text>
              <View className="gap-2">
                {section.body.map((point) => (
                  <View key={point} className="flex-row gap-3">
                    <Text className="text-teal-700 text-base leading-6">•</Text>
                    <Text className="flex-1 text-base text-muted leading-7">{point}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View className="bg-[#17324d] rounded-3xl p-6 gap-4 shadow-sm">
            <Text className="text-2xl font-bold text-white">Contact</Text>
            <Text className="text-white/90 leading-7">
              If you have questions about this policy, contact us through the app’s settings screen or
              use your support email and website when you publish the app.
            </Text>
            <View className="gap-2">
              <Text className="text-white font-semibold">Support Email: support@yourdomain.com</Text>
              <Text className="text-white font-semibold">Privacy URL: https://yourdomain.com/privacy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
