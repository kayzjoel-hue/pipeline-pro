import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useOnboarding } from '@/lib/onboarding-context';
import * as Haptics from 'expo-haptics';

export default function OnboardingAddJob() {
  const router = useRouter();
  const { nextStep } = useOnboarding();

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextStep();
    router.push("/onboarding/followup");
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-blue-50 to-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
        <View className="flex-1 justify-between py-12">
          {/* Progress */}
          <View className="flex-row gap-2 mb-8">
            <View className="flex-1 h-1 bg-teal-600 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
            <View className="flex-1 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Content */}
          <View className="gap-6">
            <View className="items-center gap-3">
              <Text className="text-5xl">➕</Text>
              <Text className="text-3xl font-bold text-gray-900">Add Your First Job</Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-4">
              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Step 1: Tap &quot;Add New Job&quot;</Text>
                <Text className="text-sm text-gray-600">
                  From the dashboard, tap the &quot;Add New Job&quot; button to create a new application entry.
                </Text>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Step 2: Fill in the Details</Text>
                <Text className="text-sm text-gray-600">
                  Enter the company name, job title, location, and salary range. These details help you stay organized.
                </Text>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="gap-3">
                <Text className="font-semibold text-gray-900">Step 3: Set the Status</Text>
                <Text className="text-sm text-gray-600">
                  Choose the application status: Applied, Interview, Offer, or Rejected.
                </Text>
              </View>
            </View>

            <View className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <Text className="text-sm text-teal-900">
                💡 <Text className="font-semibold">Pro Tip:</Text> Add jobs as soon as you apply to stay on top of your pipeline.
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
