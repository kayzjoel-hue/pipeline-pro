import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/screen-container";
import { useJobsStorage } from "@/hooks/use-jobs-storage";

/**
 * Dashboard Screen - Pipeline Pro
 *
 * Shows an overview of the user's job pipeline with:
 * - Pipeline summary (4 stages)
 * - Follow-up count
 * - Quick stats
 * - Recent activity
 * Data is loaded from persistent storage
 */
export default function HomeScreen() {
  const router = useRouter();
  const { jobs, isLoading, loadJobs } = useJobsStorage();

  useFocusEffect(
    useCallback(() => {
      void loadJobs();
    }, [loadJobs]),
  );

  // Calculate stats from persistent data
  const jobStats = useMemo(() => {
    return {
      applied: jobs.filter((j) => j.status === "Applied").length,
      interview: jobs.filter((j) => j.status === "Interview").length,
      offer: jobs.filter((j) => j.status === "Offer").length,
      rejected: jobs.filter((j) => j.status === "Rejected").length,
    };
  }, [jobs]);

  const followUpCount = useMemo(() => {
    // Count jobs in Interview or Offer status as needing follow-ups
    return jobs.filter((j) => j.status === "Interview" || j.status === "Offer").length;
  }, [jobs]);

  const totalApplications = jobs.length;
  const successRate = totalApplications > 0 ? Math.round((jobStats.offer / totalApplications) * 100) : 0;

  // Get recent activity (last 3 jobs)
  const recentActivity = useMemo(() => {
    return [...jobs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  }, [jobs]);

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-muted mt-4">Loading dashboard...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Pipeline Pro</Text>
            <Text className="text-sm text-muted">Your job search at a glance</Text>
          </View>

          {/* Pipeline Summary */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Pipeline Status</Text>
            <View className="flex-row gap-3">
              <PipelineStage label="Applied" count={jobStats.applied} color="bg-primary" />
              <PipelineStage label="Interview" count={jobStats.interview} color="bg-warning" />
              <PipelineStage label="Offer" count={jobStats.offer} color="bg-success" />
              <PipelineStage label="Rejected" count={jobStats.rejected} color="bg-error" />
            </View>
          </View>

          {/* Follow-Up Alert */}
          {followUpCount > 0 && (
            <View className="bg-warning/10 border border-warning rounded-2xl p-4">
              <Text className="text-sm font-semibold text-foreground">
                {followUpCount} Follow-Up{followUpCount !== 1 ? "s" : ""} Due
              </Text>
              <Text className="text-xs text-muted mt-1">You have pending follow-ups to complete</Text>
            </View>
          )}

          {/* Quick Stats */}
          <View className="gap-3">
            <StatCard label="Total Applications" value={totalApplications} />
            <StatCard label="Success Rate" value={`${successRate}%`} />
          </View>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Recent Activity</Text>
              <View className="gap-2">
                {recentActivity.map((job) => (
                  <Pressable
                    key={job.id}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/job-detail",
                        params: { id: job.id },
                      })
                    }
                    className="active:opacity-80"
                  >
                    <ActivityItem company={job.company} title={job.title} status={job.status} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {totalApplications === 0 && (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center gap-2">
              <Text className="text-base font-semibold text-foreground">Get Started</Text>
              <Text className="text-sm text-muted text-center">
                Add your first job application to start tracking your pipeline
              </Text>
            </View>
          )}

          {/* Call to Action */}
          <View className="gap-3">
            <Pressable
              onPress={() => router.push("/(tabs)/add-job")}
              className="bg-primary rounded-xl py-3 px-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">+ Add New Job</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)/jobs")}
              className="border border-primary rounded-xl py-3 px-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-primary">View All Jobs</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * PipelineStage Component
 * Displays a single stage in the pipeline with count
 */
function PipelineStage({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View className="flex-1 items-center gap-2">
      <View className={`${color} rounded-full w-12 h-12 items-center justify-center`}>
        <Text className="text-white font-bold text-lg">{count}</Text>
      </View>
      <Text className="text-xs text-muted text-center">{label}</Text>
    </View>
  );
}

/**
 * StatCard Component
 * Displays a single statistic
 */
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="bg-surface rounded-xl p-4 border border-border flex-row justify-between items-center">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
    </View>
  );
}

/**
 * ActivityItem Component
 * Displays a single activity item
 */
function ActivityItem({ company, title, status }: { company: string; title: string; status: string }) {
  const statusColor = status === "Interview" ? "bg-warning" : status === "Applied" ? "bg-primary" : "bg-error";
  const statusTextColor = status === "Interview" ? "text-warning" : status === "Applied" ? "text-primary" : "text-error";

  return (
    <View className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{company}</Text>
        <Text className="text-xs text-muted">{title}</Text>
      </View>
      <View className={`${statusColor}/20 rounded-full px-3 py-1`}>
        <Text className={`text-xs font-semibold ${statusTextColor}`}>{status}</Text>
      </View>
    </View>
  );
}
