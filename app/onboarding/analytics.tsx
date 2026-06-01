import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useOnboarding } from '@/lib/onboarding-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingAnalytics() {
  const router = useRouter();
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextStep();
    router.push("/onboarding/complete");
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-blue-50 to-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View className="flex-1 justify-between py-12">
          {/* Progress */}
          <View className="flex-row gap-2 mb-8">
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Content */}
          <View className="gap-6">
            <View className="items-center gap-3">
              <Text className="text-5xl">📊</Text>
              <Text className="text-3xl font-bold text-gray-900">Track Your Progress</Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-4">
              <View className="gap-3">
                <Text className="font-semibold text-gray-900">View Your Analytics</Text>
                <Text className="text-sm text-gray-600">
                  The Analytics tab shows you key metrics about your job search performance.
                </Text>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="font-semibold text-gray-900 text-sm">📈 Total Applications</Text>
                  <Text className="text-xs text-gray-600">Track how many jobs you&apos;ve applied to</Text>
                </View>

                <View className="gap-2">
                  <Text className="font-semibold text-gray-900 text-sm">🎯 Interview Rate</Text>
                  <Text className="text-xs text-gray-600">See what % of applications lead to interviews</Text>
                </View>

                <View className="gap-2">
                  <Text className="font-semibold text-gray-900 text-sm">✅ Success Rate</Text>
                  <Text className="text-xs text-gray-600">Monitor your conversion to offers</Text>
                </View>

                <View className="gap-2">
                  <Text className="font-semibold text-gray-900 text-sm">📊 Pipeline Breakdown</Text>
                  <Text className="text-xs text-gray-600">See applications organized by status</Text>
                </View>
              </View>
            </View>

            <View className="bg-green-50 rounded-xl p-4 border border-green-200">
              <Text className="text-sm text-green-900">
                🎓 <Text className="font-semibold">Insight:</Text> Use analytics to identify bottlenecks in your job search process.
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
