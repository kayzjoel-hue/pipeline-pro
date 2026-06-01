import { Text, View, Pressable, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useCallback, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/screen-container";
import { useJobsStorage, type Job } from "@/hooks/use-jobs-storage";

/**
 * Jobs Screen - List of all job applications with filtering and sorting
 * Data is persisted using AsyncStorage
 */
export default function JobsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // "date" or "status"

  // Load jobs from persistent storage
  const { jobs, isLoading, error, loadJobs } = useJobsStorage();

  useFocusEffect(
    useCallback(() => {
      void loadJobs();
    }, [loadJobs]),
  );

  // Define status order for sorting
  const statusOrder: Record<string, number> = {
    Applied: 1,
    Interview: 2,
    Offer: 3,
    Rejected: 4,
  };

  const filteredAndSortedJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || job.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "status") {
        // Sort by status order (Applied -> Interview -> Offer -> Rejected)
        const statusA = statusOrder[a.status] || 0;
        const statusB = statusOrder[b.status] || 0;
        return statusA - statusB;
      } else {
        // Default sort by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview":
        return "bg-warning";
      case "Applied":
        return "bg-primary";
      case "Offer":
        return "bg-success";
      case "Rejected":
        return "bg-error";
      default:
        return "bg-muted";
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/job-detail",
          params: { id: item.id },
        })
      }
      className="bg-surface rounded-xl p-4 mb-3 border border-border active:opacity-80"
    >
      <View className="flex-row justify-between items-start gap-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{item.company}</Text>
          <Text className="text-sm text-muted mt-1">{item.title}</Text>
          <Text className="text-xs text-muted mt-2">{item.date}</Text>
          {item.location && <Text className="text-xs text-muted mt-1">{item.location}</Text>}
        </View>
        <View className={`${getStatusColor(item.status)}/20 rounded-full px-3 py-1`}>
          <Text className={`text-xs font-semibold ${getStatusColor(item.status).replace("bg-", "text-")}`}>
            {item.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-muted mt-4">Loading jobs...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="gap-1 mb-6">
          <Text className="text-3xl font-bold text-foreground">Job Applications</Text>
          <Text className="text-sm text-muted">{filteredAndSortedJobs.length} applications</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-error/10 border border-error rounded-xl p-3 mb-4">
            <Text className="text-xs text-error">{error}</Text>
          </View>
        )}

        {/* Search Bar */}
        <View className="mb-4">
          <TextInput
            placeholder="Search by company or title..."
            placeholderTextColor="#687076"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
          />
        </View>

        {/* Filter Buttons */}
        <View className="flex-row gap-2 mb-4 pb-4 border-b border-border">
          {["all", "Applied", "Interview", "Offer", "Rejected"].map((status) => (
            <Pressable
              key={status}
              onPress={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-full ${
                filterStatus === status ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  filterStatus === status ? "text-background" : "text-foreground"
                }`}
              >
                {status === "all" ? "All" : status}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sort Options */}
        <View className="flex-row gap-2 mb-4">
          <Text className="text-xs text-muted self-center">Sort by:</Text>
          <Pressable
            onPress={() => setSortBy("date")}
            className={`px-3 py-2 rounded-full ${
              sortBy === "date" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                sortBy === "date" ? "text-background" : "text-foreground"
              }`}
            >
              Date
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSortBy("status")}
            className={`px-3 py-2 rounded-full ${
              sortBy === "status" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                sortBy === "status" ? "text-background" : "text-foreground"
              }`}
            >
              Status
            </Text>
          </Pressable>
        </View>

        {/* Job List */}
        {filteredAndSortedJobs.length > 0 ? (
          <FlatList
            data={filteredAndSortedJobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-center">
              {jobs.length === 0 ? "No jobs yet. Add your first application!" : "No jobs found"}
            </Text>
          </View>
        )}

        {/* Add Job Button */}
        <Pressable className="bg-primary rounded-xl py-3 px-4 mt-6 active:opacity-80">
          <Text className="text-center text-base font-semibold text-background">+ Add New Job</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
