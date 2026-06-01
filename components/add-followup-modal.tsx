import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, Switch } from "react-native";
import { useFollowUpsStorage } from '@/hooks/use-followups-storage';
import { FollowUp, FollowUpFormData } from '../lib/types/followup';
import { scheduleFollowUpNotification } from '@/lib/notifications';

interface AddFollowUpModalProps {
  visible: boolean;
  jobId: string;
  jobCompany: string;
  followUp?: FollowUp;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddFollowUpModal({
  visible,
  jobId,
  jobCompany,
  followUp,
  onClose,
  onSuccess,
}: AddFollowUpModalProps) {
  const { addFollowUp, updateFollowUp } = useFollowUpsStorage();

  const [title, setTitle] = useState(followUp?.title || "");
  const [description, setDescription] = useState(followUp?.description || "");
  const [dueDate, setDueDate] = useState(followUp?.dueDate || getTomorrowDateString());
  const [dueTime, setDueTime] = useState(followUp?.dueTime || "09:00");
  const [notificationEnabled, setNotificationEnabled] = useState(
    followUp?.notificationEnabled ?? true
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(followUp?.title || "");
    setDescription(followUp?.description || "");
    setDueDate(followUp?.dueDate || getTomorrowDateString());
    setDueTime(followUp?.dueTime || "09:00");
    setNotificationEnabled(followUp?.notificationEnabled ?? true);
    setErrors({});
  }, [followUp, visible]);

  const scheduledDate = useMemo(() => new Date(`${dueDate}T${dueTime || "09:00"}`), [dueDate, dueTime]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (Number.isNaN(scheduledDate.getTime())) {
      newErrors.dueDate = "Enter a valid date and time";
    } else if (scheduledDate <= new Date()) {
      newErrors.dueDate = 'Date and time must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (text: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      setDueDate(text);
    }
  };

  const handleTimeChange = (text: string) => {
    if (/^\d{2}:\d{2}$/.test(text)) {
      setDueTime(text);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData: FollowUpFormData = {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        notificationEnabled,
      };

      if (followUp) {
        await updateFollowUp(followUp.id, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const newFollowUp = await addFollowUp(jobId, formData);
        if (notificationEnabled && newFollowUp) {
          await scheduleFollowUpNotification(
            newFollowUp.id,
            jobCompany,
            title,
            formData.dueDate,
            dueTime
          );
        }
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving follow-up:', error);
      setErrors({ submit: 'Failed to save follow-up' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDueDate(getTomorrowDateString());
    setDueTime("09:00");
    setNotificationEnabled(true);
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-white rounded-t-3xl mt-auto border-t border-gray-200">
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="mb-6 gap-2">
              <Text className="text-2xl font-bold text-gray-900">
                {followUp ? 'Edit Follow-Up' : 'Add Follow-Up'}
              </Text>
              <Text className="text-sm text-gray-600">
                {jobCompany} • Set a clear next move and keep the thread alive.
              </Text>
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Title *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Send thank you email"
                placeholderTextColor="#94a3b8"
                className={`border rounded-2xl px-4 py-3 bg-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <Text className="text-red-600 text-xs mt-1">{errors.title}</Text>}
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add notes about this follow-up..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#94a3b8"
                className="border border-gray-300 rounded-2xl px-4 py-3 bg-white min-h-[110px]"
              />
            </View>

            {/* Due Date */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Due Date *</Text>
              <TextInput
                value={dueDate}
                onChangeText={handleDateChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                className={`border rounded-lg px-4 py-3 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <Text className="text-red-600 text-xs mt-1">{errors.dueDate}</Text>}
            </View>

            {/* Due Time */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">Due Time</Text>
              <TextInput
                value={dueTime}
                onChangeText={handleTimeChange}
                placeholder="HH:MM"
                placeholderTextColor="#94a3b8"
                className="border border-gray-300 rounded-2xl px-4 py-3 bg-white"
              />
            </View>

            {/* Notification Toggle */}
            <View className="flex-row items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <Text className="font-semibold text-gray-900">Enable Notification</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
              />
            </View>

            {errors.submit && (
              <Text className="text-red-600 text-center mb-4">{errors.submit}</Text>
            )}

            {/* Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleClose}
                className="flex-1 border border-gray-300 rounded-2xl py-3"
                disabled={loading}
              >
                <Text className="text-center font-semibold text-gray-900">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                className="flex-1 bg-primary rounded-2xl py-3"
                disabled={loading}
              >
                <Text className="text-center font-semibold text-white">
                  {loading ? 'Saving...' : 'Save Follow-Up'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
