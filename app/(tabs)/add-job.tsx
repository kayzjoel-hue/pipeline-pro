import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useJobsStorage } from "@/hooks/use-jobs-storage";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface FormData {
  company: string;
  title: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  date: string;
  location: string;
  salary: string;
  notes: string;
  jobUrl: string;
}

interface FormErrors {
  company?: string;
  title?: string;
  date?: string;
}

export default function AddJobScreen() {
  const router = useRouter();
  const colors = useColors();
  const { addJob, isLoading } = useJobsStorage();

  const [formData, setFormData] = useState<FormData>({
    company: "",
    title: "",
    status: "Applied",
    date: new Date().toISOString().split("T")[0],
    location: "",
    salary: "",
    notes: "",
    jobUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.date) {
      newErrors.date = "Application date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await addJob({
        company: formData.company.trim(),
        title: formData.title.trim(),
        status: formData.status,
        date: formData.date,
        location: formData.location.trim() || undefined,
        salary: formData.salary.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        jobUrl: formData.jobUrl.trim() || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to add job. Please try again.");
    }
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Add Job Application
            </Text>
            <Text className="text-base text-muted">
              Fill in the details of your new job application
            </Text>
          </View>

          {/* Company Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Company Name *
            </Text>
            <TextInput
              style={{
                borderColor: errors.company ? colors.error : colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="e.g., Google, Microsoft, Apple"
              placeholderTextColor={colors.muted}
              value={formData.company}
              onChangeText={(value) => handleInputChange("company", value)}
              editable={!isLoading}
            />
            {errors.company && (
              <Text className="text-sm text-error">{errors.company}</Text>
            )}
          </View>

          {/* Job Title */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Job Title *
            </Text>
            <TextInput
              style={{
                borderColor: errors.title ? colors.error : colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="e.g., Senior Product Manager"
              placeholderTextColor={colors.muted}
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              editable={!isLoading}
            />
            {errors.title && (
              <Text className="text-sm text-error">{errors.title}</Text>
            )}
          </View>

          {/* Status */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Status
            </Text>
            <View className="flex-row gap-2">
              {(["Applied", "Interview", "Offer", "Rejected"] as const).map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      handleInputChange("status", status);
                    }}
                    style={{
                      backgroundColor:
                        formData.status === status ? colors.primary : colors.surface,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor:
                        formData.status === status ? colors.primary : colors.border,
                    }}
                    className="flex-1"
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        formData.status === status
                          ? "text-background"
                          : "text-foreground"
                      }`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* Application Date */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Application Date *
            </Text>
            <TextInput
              style={{
                borderColor: errors.date ? colors.error : colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              value={formData.date}
              onChangeText={(value) => handleInputChange("date", value)}
              editable={!isLoading}
            />
            {errors.date && (
              <Text className="text-sm text-error">{errors.date}</Text>
            )}
          </View>

          {/* Location */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Location
            </Text>
            <TextInput
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="e.g., San Francisco, CA"
              placeholderTextColor={colors.muted}
              value={formData.location}
              onChangeText={(value) => handleInputChange("location", value)}
              editable={!isLoading}
            />
          </View>

          {/* Salary */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Salary Range
            </Text>
            <TextInput
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="e.g., $150k - $200k"
              placeholderTextColor={colors.muted}
              value={formData.salary}
              onChangeText={(value) => handleInputChange("salary", value)}
              editable={!isLoading}
            />
          </View>

          {/* Job URL */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Job Posting URL
            </Text>
            <TextInput
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
              }}
              placeholder="https://..."
              placeholderTextColor={colors.muted}
              value={formData.jobUrl}
              onChangeText={(value) => handleInputChange("jobUrl", value)}
              editable={!isLoading}
            />
          </View>

          {/* Notes */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Notes
            </Text>
            <TextInput
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.foreground,
                backgroundColor: colors.surface,
                minHeight: 100,
                textAlignVertical: "top",
              }}
              placeholder="Add any notes about this application..."
              placeholderTextColor={colors.muted}
              value={formData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              editable={!isLoading}
            />
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3 pt-4">
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              style={{
                backgroundColor: colors.surface,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.border,
                flex: 1,
              }}
            >
              <Text className="text-center text-base font-semibold text-foreground">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text className="text-center text-base font-semibold text-background">
                  Save Job
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
