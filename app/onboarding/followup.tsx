import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useOnboarding } from '@/lib/onboarding-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingFollowUp() {
  const router = useRouter();
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextStep();
    router.push("/onboarding/analytics");
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-blue-50 to-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View className="flex-1 justify-between py-12">
          {/* Progress */}
          <View className="flex-row gap-2 mb-8">
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Content */}
          <View className="gap-6">
            <View className="items-center gap-3">
              <Text className="text-5xl">📞</Text>
              <Text className="text-3xl font-bold text-gray-900">Schedule Follow-Ups</Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-4">
              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Why Follow-Ups Matter</Text>
                <Text className="text-sm text-gray-600">
                  Studies show that 40% more candidates get callbacks when they follow up consistently. Never miss an opportunity!
                </Text>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="gap-3">
                <Text className="font-semibold text-gray-900">How to Schedule</Text>
                <Text className="text-sm text-gray-600 mb-2">
                  1. Open a job application from your list
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  2. Tap &quot;Add Follow-Up&quot; in the Follow-Ups section
                </Text>
                <Text className="text-sm text-gray-600">
                  3. Set the date, time, and description
                </Text>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Get Reminders</Text>
                <Text className="text-sm text-gray-600">
                  Enable notifications to get reminded about pending follow-ups. Never forget again!
                </Text>
              </View>
            </View>

            <View className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <Text className="text-sm text-amber-900">
                ⏰ <Text className="font-semibold">Best Practice:</Text> Follow up within 3-5 business days of your interview.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleNext}
              className="bg-teal-600 rounded-lg py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
