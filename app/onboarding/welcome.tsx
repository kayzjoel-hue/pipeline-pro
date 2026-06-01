import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useOnboarding } from "@/lib/onboarding-context";
import * as Haptics from "expo-haptics";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { nextStep, skipOnboarding } = useOnboarding();

  const handleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/login" as never);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextStep();
    router.push("/onboarding/add-job");
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await skipOnboarding();
    router.replace("/login" as never);
  };

  return (
    <ScreenContainer className="bg-[#f6f1ea]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <View className="flex-1 justify-between py-10 gap-6">
          <View className="gap-6">
            <View className="items-center gap-3">
              <View className="w-20 h-20 bg-[#17324d] rounded-[28px] items-center justify-center shadow-lg">
                <Text className="text-4xl">💼</Text>
              </View>
              <Text className="text-4xl font-bold text-[#0f172a] text-center">Pipeline Pro</Text>
              <Text className="text-base text-[#475569] text-center max-w-[280px]">
                A sharper way to track applications, follow up, and keep your search moving.
              </Text>
            </View>

            <View className="bg-white rounded-[28px] p-5 border border-[#e5dccf] shadow-sm gap-4">
              <View className="gap-2">
                <Text className="text-2xl font-bold text-[#0f172a]">Sign in to get started</Text>
                <Text className="text-sm text-[#64748b] leading-6">
                  Join the people keeping their pipeline clean, current, and actually under control.
                </Text>
              </View>

              <Pressable
                onPress={handleSignIn}
                className="bg-[#17324d] rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-white font-semibold text-lg">Open Login</Text>
              </Pressable>

              <Pressable
                onPress={handleSkip}
                className="border border-[#cbd5e1] rounded-2xl py-4 items-center active:opacity-80"
              >
                <Text className="text-[#334155] font-semibold text-lg">Explore first</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              <PromoCard
                title="Featured by job hunters"
                body="Built for the old-school discipline of tracking every lead, with modern speed."
                tag="Trusted"
              />
              <PromoCard
                title="Track the whole hunt"
                body="Applications, follow-ups, and outcomes in one place. No inbox archaeology."
                tag="Popular"
              />
              <PromoCard
                title="Better follow-through"
                body="See what needs attention before a recruiter ghosts your calendar."
                tag="Productivity"
              />
            </View>
          </View>

          <View className="gap-3">
            <View className="bg-[#efe7dc] rounded-2xl p-4 border border-[#ded2c0]">
              <Text className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8b6f47] mb-2">
                Why people stick with it
              </Text>
              <Text className="text-sm text-[#3f4a59] leading-6">
                Simple onboarding. Clean dashboard. Real accountability. No fluff, just the pipeline.
              </Text>
            </View>

            <Pressable
              onPress={handleNext}
              className="bg-[#b45309] rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">Get Started</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function PromoCard({ title, body, tag }: { title: string; body: string; tag: string }) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-[#e5dccf]">
      <Text className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b45309] mb-2">
        {tag}
      </Text>
      <Text className="text-base font-semibold text-[#0f172a]">{title}</Text>
      <Text className="text-sm text-[#64748b] leading-6 mt-1">{body}</Text>
    </View>
  );
}
