import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/screen-container";
import { useJobsStorage } from "@/hooks/use-jobs-storage";

/**
 * Analytics Screen - Job search insights and trends
 * Data is loaded from persistent storage
 */
export default function AnalyticsScreen() {
  const { jobs, isLoading, loadJobs } = useJobsStorage();

  useFocusEffect(
    useCallback(() => {
      void loadJobs();
    }, [loadJobs]),
  );

  // Calculate analytics from persistent data
  const analytics = useMemo(() => {
    const totalApplications = jobs.length;
    const interviews = jobs.filter((j) => j.status === "Interview").length;
    const offers = jobs.filter((j) => j.status === "Offer").length;
    const rejections = jobs.filter((j) => j.status === "Rejected").length;

    const interviewRate = totalApplications > 0 ? Math.round((interviews / totalApplications) * 100) : 0;
    const successRate = totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;
    const rejectionRate = totalApplications > 0 ? Math.round((rejections / totalApplications) * 100) : 0;

    // Calculate average time to interview
    const appliedJobs = jobs.filter((j) => j.status !== "Applied");
    const avgTimeToInterview =
      appliedJobs.length > 0
        ? Math.round(
            appliedJobs.reduce((sum, job) => {
              const appliedDate = new Date(job.date);
              const updatedDate = new Date(job.updatedAt);
              const days = Math.floor((updatedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
              return sum + days;
            }, 0) / appliedJobs.length
          )
        : 0;

    return {
      totalApplications,
      interviews,
      offers,
      rejections,
      interviewRate,
      successRate,
      rejectionRate,
      avgTimeToInterview,
    };
  }, [jobs]);

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-muted mt-4">Loading analytics...</Text>
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Analytics</Text>
            <Text className="text-sm text-muted">Your job search insights</Text>
          </View>

          {/* Key Metrics */}
          <View className="gap-3">
            <MetricCard
              label="Total Applications"
              value={analytics.totalApplications}
              subtext={analytics.totalApplications === 0 ? "Add your first job" : "Since March 2026"}
            />
            <MetricCard
              label="Interviews Scheduled"
              value={analytics.interviews}
              subtext={`${analytics.interviewRate}% conversion`}
            />
            <MetricCard
              label="Offers Received"
              value={analytics.offers}
              subtext={`${analytics.successRate}% success rate`}
            />
            <MetricCard
              label="Rejection Rate"
              value={`${analytics.rejectionRate}%`}
              subtext={`${analytics.rejections} rejections`}
            />
          </View>

          {/* Insights */}
          {analytics.totalApplications > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Insights</Text>
              <View className="gap-2">
                {analytics.avgTimeToInterview > 0 && (
                  <InsightItem text={`Average time to first interview: ${analytics.avgTimeToInterview} days`} />
                )}
                {analytics.successRate >= 10 && (
                  <InsightItem text="Your success rate is above industry average" />
                )}
                {analytics.interviewRate > 0 && (
                  <InsightItem text={`You have a ${analytics.interviewRate}% interview rate`} />
                )}
                {analytics.totalApplications >= 5 && (
                  <InsightItem text="You're building momentum with your applications" />
                )}
              </View>
            </View>
          )}

          {/* Recommendations */}
          <View className="bg-primary/10 border border-primary rounded-2xl p-4">
            <Text className="text-sm font-semibold text-foreground mb-2">💡 Tip</Text>
            <Text className="text-xs text-muted leading-relaxed">
              {analytics.totalApplications === 0
                ? "Start by adding your job applications to track your pipeline and see insights."
                : "Keep your follow-up momentum going! Schedule follow-ups within 3 days of applying for best results."}
            </Text>
          </View>

          {/* Status Breakdown */}
          {analytics.totalApplications > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Pipeline Breakdown</Text>
              <View className="gap-2">
                <StatusBreakdownItem
                  label="Applied"
                  count={analytics.totalApplications - analytics.interviews - analytics.offers - analytics.rejections}
                  color="bg-primary"
                />
                <StatusBreakdownItem label="Interview" count={analytics.interviews} color="bg-warning" />
                <StatusBreakdownItem label="Offer" count={analytics.offers} color="bg-success" />
                <StatusBreakdownItem label="Rejected" count={analytics.rejections} color="bg-error" />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function MetricCard({ label, value, subtext }: { label: string; value: string | number; subtext: string }) {
  return (
    <View className="bg-surface rounded-xl p-4 border border-border">
      <Text className="text-sm text-muted">{label}</Text>
      <View className="flex-row items-baseline gap-2 mt-2">
        <Text className="text-3xl font-bold text-foreground">{value}</Text>
        <Text className="text-xs text-muted">{subtext}</Text>
      </View>
    </View>
  );
}

function InsightItem({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2 py-2">
      <Text className="text-primary font-bold">•</Text>
      <Text className="text-xs text-muted flex-1">{text}</Text>
    </View>
  );
}

function StatusBreakdownItem({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className={`${color} w-3 h-3 rounded-full`} />
      <Text className="text-sm text-foreground flex-1">{label}</Text>
      <Text className="text-sm font-semibold text-foreground">{count}</Text>
    </View>
  );
}
