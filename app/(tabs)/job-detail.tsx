import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useJobsStorage, type Job } from "@/hooks/use-jobs-storage";
import { useFollowUpsStorage } from "@/hooks/use-followups-storage";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { AddFollowUpModal } from "@/components/add-followup-modal";
import { FollowUpList } from "@/components/follow-up-list";
import { FollowUp } from "@/lib/types/followup";

const STATUS_COLORS: Record<Job["status"], string> = {
  Applied: "#0a7ea4", // Teal
  Interview: "#f59e0b", // Amber
  Offer: "#22c55e", // Green
  Rejected: "#ef4444", // Red
};

export default function JobDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getJob, deleteJob, isLoading, loadJobs } = useJobsStorage();
  const { getJobFollowUps, loadFollowUps, deleteFollowUp, completeFollowUp } = useFollowUpsStorage();

  const [job, setJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);

  useEffect(() => {
    if (id) {
      const foundJob = getJob(id);
      setJob(foundJob || null);
    }
  }, [id, getJob]);

  useFocusEffect(
    React.useCallback(() => {
      void loadJobs();
      void loadFollowUps();
    }, [loadJobs, loadFollowUps]),
  );

  const followUps = id ? getJobFollowUps(id) : [];
  const pendingFollowUps = followUps.filter((followUp) => followUp.status === "pending");
  const completedFollowUps = followUps.filter((followUp) => followUp.status === "completed");

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id) {
      router.push({
        pathname: "/(tabs)/edit-job",
        params: { id },
      });
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Job?",
      `Are you sure you want to delete the ${job?.status} application at ${job?.company}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setDeleting(true);
              if (id) {
                await deleteJob(id);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.back();
              }
            } catch {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", "Failed to delete job. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleOpenURL = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open URL");
    });
  };

  const handleAddFollowUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingFollowUp(null);
    setFollowUpModalVisible(true);
  };

  const handleEditFollowUp = (followUp: FollowUp) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingFollowUp(followUp);
    setFollowUpModalVisible(true);
  };

  const handleCloseFollowUpModal = () => {
    setFollowUpModalVisible(false);
    setEditingFollowUp(null);
  };

  const handleReloadFollowUps = () => {
    void loadFollowUps();
  };

  if (!id) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6">
        <View className="items-center gap-3">
          <Text className="text-lg font-semibold text-foreground">Job ID is missing</Text>
          <Text className="text-sm text-muted text-center">
            Open this screen from the Jobs list, or pass a valid job id in the URL.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/jobs")}
            className="px-4 py-3 rounded-lg bg-primary"
          >
            <Text className="text-background font-semibold">Go to Jobs</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!job) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center p-6">
        <View className="items-center gap-3">
          <Text className="text-lg font-semibold text-foreground">Job not found</Text>
          <Text className="text-sm text-muted text-center">
            That job may have been deleted, or the id in the URL is invalid.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/jobs")}
            className="px-4 py-3 rounded-lg bg-primary"
          >
            <Text className="text-background font-semibold">Back to Jobs</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const statusColor = STATUS_COLORS[job.status];

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="flex-row items-center gap-2"
          >
            <Text className="text-base font-semibold text-primary">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="gap-3">
            <Text className="text-3xl font-bold text-foreground">
              {job.company}
            </Text>
            <Text className="text-lg text-muted">{job.title}</Text>

            {/* Status Badge */}
            <View
              style={{ backgroundColor: statusColor }}
              className="self-start px-3 py-1 rounded-full"
            >
              <Text className="text-sm font-semibold text-white">
                {job.status}
              </Text>
            </View>
          </View>

          {/* Application Date */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">
              Application Date
            </Text>
            <Text className="text-base text-foreground">{job.date}</Text>
          </View>

          {/* Location */}
          {job.location && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">Location</Text>
              <Text className="text-base text-foreground">{job.location}</Text>
            </View>
          )}

          {/* Salary */}
          {job.salary && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">
                Salary Range
              </Text>
              <Text className="text-base text-foreground">{job.salary}</Text>
            </View>
          )}

          {/* Job URL */}
          {job.jobUrl && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">
                Job Posting
              </Text>
              <TouchableOpacity
                onPress={() => handleOpenURL(job.jobUrl!)}
                className="flex-row items-center gap-2"
              >
                <Text className="text-base font-semibold text-primary">
                  Open Job Posting →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notes */}
          {job.notes && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-muted">Notes</Text>
              <View
                style={{ backgroundColor: colors.surface }}
                className="p-3 rounded-lg"
              >
                <Text className="text-base text-foreground leading-relaxed">
                  {job.notes}
                </Text>
              </View>
            </View>
          )}

          {/* Timestamps */}
          <View
            style={{ backgroundColor: colors.surface }}
            className="p-3 rounded-lg gap-2"
          >
            <Text className="text-xs text-muted">
              Added: {new Date(job.createdAt).toLocaleDateString()}
            </Text>
            <Text className="text-xs text-muted">
              Updated: {new Date(job.updatedAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Follow-Ups Section (Placeholder) */}
          <View className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text className="text-lg font-bold text-foreground">Follow-Ups</Text>
                <Text className="text-sm text-muted">
                  Keep the conversation warm and the next step visible.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleAddFollowUp}
                className="px-4 py-2 rounded-full bg-primary"
              >
                <Text className="text-sm font-semibold text-background">+ Add</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: colors.surface }} className="p-4 rounded-2xl border border-border gap-3">
              <View className="flex-row gap-2 flex-wrap">
                <SummaryPill label="Total" value={followUps.length.toString()} />
                <SummaryPill label="Pending" value={pendingFollowUps.length.toString()} />
                <SummaryPill label="Done" value={completedFollowUps.length.toString()} />
              </View>

              <FollowUpList
                jobId={job.id}
                followUps={followUps}
                onEditFollowUp={handleEditFollowUp}
                onDeleteFollowUp={deleteFollowUp}
                onCompleteFollowUp={async (followUp) => {
                  await completeFollowUp(followUp.id);
                  await loadFollowUps();
                }}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 pt-4">
            <TouchableOpacity
              onPress={handleEdit}
              disabled={deleting}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                opacity: deleting ? 0.6 : 1,
              }}
            >
              <Text className="text-center text-base font-semibold text-background">
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={deleting}
              style={{
                backgroundColor: "#ef4444",
                paddingVertical: 12,
                borderRadius: 8,
                flex: 1,
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text className="text-center text-base font-semibold text-background">
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {id && (
        <AddFollowUpModal
          visible={followUpModalVisible}
          jobId={id}
          jobCompany={job.company}
          followUp={editingFollowUp ?? undefined}
          onClose={handleCloseFollowUpModal}
          onSuccess={handleReloadFollowUps}
        />
      )}
    </ScreenContainer>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="bg-white rounded-2xl px-3 py-2 border border-border min-w-[92px]">
      <Text className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</Text>
      <Text className="text-base font-semibold text-foreground mt-1">{value}</Text>
    </View>
  );
}
