import { View, Text, Pressable, Alert } from "react-native";
import { useFollowUpsStorage } from "@/hooks/use-followups-storage";
import { FollowUp } from "../lib/types/followup";
import { MaterialIcons } from '@expo/vector-icons';

interface FollowUpListProps {
  jobId: string;
  followUps?: FollowUp[];
  onEditFollowUp?: (followUp: FollowUp) => void;
  onDeleteFollowUp?: (followUpId: string) => void;
  onCompleteFollowUp?: (followUp: FollowUp) => void;
}

export function FollowUpList({
  jobId,
  followUps: followUpsProp,
  onEditFollowUp,
  onDeleteFollowUp,
  onCompleteFollowUp,
}: FollowUpListProps) {
  const { getJobFollowUps, deleteFollowUp, completeFollowUp } = useFollowUpsStorage();
  const followUps = followUpsProp ?? getJobFollowUps(jobId);

  const handleDelete = (followUpId: string) => {
    Alert.alert(
      "Delete Follow-Up",
      "Are you sure you want to delete this follow-up?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (onDeleteFollowUp) {
              onDeleteFollowUp(followUpId);
              return;
            }

            void deleteFollowUp(followUpId);
          },
        },
      ]
    );
  };

  const handleComplete = (followUp: FollowUp) => {
    if (onCompleteFollowUp) {
      onCompleteFollowUp(followUp);
      return;
    }

    void completeFollowUp(followUp.id);
  };

  const formatDate = (followUp: FollowUp) => {
    const date = new Date(`${followUp.dueDate}T${followUp.dueTime || "09:00"}`);
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  if (followUps.length === 0) {
    return (
      <View className="bg-[#f8fafc] rounded-2xl p-4 border border-dashed border-[#d8e0ea]">
        <Text className="text-[#64748b] text-center font-medium">No follow-ups scheduled yet</Text>
        <Text className="text-xs text-[#94a3b8] text-center mt-1">
          Add one to keep the thread warm and the next step visible.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-foreground">Follow-Ups</Text>
      <View className="gap-3">
        {followUps.map((followUp) => (
          <View
            key={followUp.id}
            className={`p-4 rounded-2xl border ${
              followUp.status === "completed"
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <View className="flex-row items-start justify-between gap-3 mb-3">
              <View className="flex-1 gap-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`text-base font-semibold ${
                      followUp.status === "completed"
                        ? "text-emerald-900 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {followUp.title}
                  </Text>
                  {followUp.status === "completed" && (
                    <MaterialIcons name="check-circle" size={18} color="#16a34a" />
                  )}
                </View>
                <Text className="text-xs text-[#64748b]">{formatDate(followUp)}</Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${
                  followUp.status === "completed" ? "bg-emerald-100" : "bg-amber-100"
                }`}
              >
                <Text
                  className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                    followUp.status === "completed" ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {followUp.status}
                </Text>
              </View>
            </View>

            {followUp.description ? (
              <Text className="text-sm text-[#475569] leading-6 mb-3">{followUp.description}</Text>
            ) : (
              <Text className="text-sm text-[#94a3b8] italic mb-3">No notes added.</Text>
            )}

            <View className="flex-row flex-wrap gap-2 items-center justify-between">
              <View className="flex-row gap-2 flex-wrap">
                <Pill label={followUp.dueTime || "09:00"} />
                {followUp.notificationEnabled ? <Pill label="Notify on" /> : <Pill label="Notify off" />}
              </View>

              {followUp.status === "pending" && (
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => onEditFollowUp?.(followUp)}
                    className="p-2 rounded-full bg-[#dbeafe]"
                  >
                    <MaterialIcons name="edit" size={16} color="#2563eb" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(followUp.id)}
                    className="p-2 rounded-full bg-[#fee2e2]"
                  >
                    <MaterialIcons name="delete" size={16} color="#dc2626" />
                  </Pressable>
                </View>
              )}
            </View>

            {followUp.status === "pending" && (
              <Pressable
                onPress={() => handleComplete(followUp)}
                className="mt-4 bg-emerald-600 rounded-2xl py-3 px-3 active:opacity-80"
              >
                <Text className="text-white text-center font-semibold text-sm">
                  Mark Complete
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View className="bg-white/80 border border-[#d8e0ea] rounded-full px-3 py-1">
      <Text className="text-[11px] font-semibold text-[#475569]">{label}</Text>
    </View>
  );
}
