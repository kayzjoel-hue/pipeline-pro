import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useOnboarding } from '@/lib/onboarding-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingComplete() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding();
    router.replace("/login" as never);
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-green-50 to-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View className="flex-1 justify-between py-12">
          {/* Progress */}
          <View className="flex-row gap-2 mb-8">
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
          </View>

          {/* Content */}
          <View className="gap-6 items-center">
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center">
              <Text className="text-6xl">🎉</Text>
            </View>

            <View className="gap-3 items-center">
              <Text className="text-3xl font-bold text-gray-900">You&apos;re All Set!</Text>
              <Text className="text-base text-gray-600 text-center">
                You&apos;re ready to start managing your job search with Pipeline Pro.
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-4 w-full">
              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Quick Recap</Text>
              </View>

              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-teal-100 rounded-full items-center justify-center">
                    <Text className="text-sm font-bold text-teal-600">1</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">Add Jobs</Text>
                    <Text className="text-xs text-gray-600">Track all your applications</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center">
                    <Text className="text-sm font-bold text-amber-600">2</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">Schedule Follow-Ups</Text>
                    <Text className="text-xs text-gray-600">Never miss an opportunity</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                    <Text className="text-sm font-bold text-green-600">3</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">Monitor Analytics</Text>
                    <Text className="text-xs text-gray-600">Track your progress</Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-blue-50 rounded-xl p-4 border border-blue-200 w-full">
              <Text className="text-sm text-blue-900">
                💡 <Text className="font-semibold">Pro Tip:</Text> Start by adding your current applications to get the most out of Pipeline Pro!
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleComplete}
              className="bg-teal-600 rounded-lg py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-lg">Start Using Pipeline Pro</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
