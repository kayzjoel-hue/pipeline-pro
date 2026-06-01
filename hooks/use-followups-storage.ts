import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FollowUp, FollowUpFormData } from '../lib/types/followup';

const STORAGE_KEY = 'pipeline_pro_followups';

export function useFollowUpsStorage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load follow-ups from storage
  const loadFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFollowUps(JSON.parse(stored));
      }
      setError(null);
    } catch (err) {
      setError('Failed to load follow-ups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add follow-up
  const addFollowUp = useCallback(
    async (jobId: string, data: FollowUpFormData) => {
      try {
        const newFollowUp: FollowUp = {
          id: Date.now().toString(),
          jobId,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          dueTime: data.dueTime,
          status: 'pending',
          notificationEnabled: data.notificationEnabled,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updated = [...followUps, newFollowUp];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setFollowUps(updated);
        return newFollowUp;
      } catch (err) {
        setError('Failed to add follow-up');
        console.error(err);
        throw err;
      }
    },
    [followUps]
  );

  // Update follow-up
  const updateFollowUp = useCallback(
    async (id: string, updates: Partial<FollowUp>) => {
      try {
        const updated = followUps.map(fu =>
          fu.id === id
            ? { ...fu, ...updates, updatedAt: new Date().toISOString() }
            : fu
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setFollowUps(updated);
      } catch (err) {
        setError('Failed to update follow-up');
        console.error(err);
        throw err;
      }
    },
    [followUps]
  );

  // Delete follow-up
  const deleteFollowUp = useCallback(
    async (id: string) => {
      try {
        const updated = followUps.filter(fu => fu.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setFollowUps(updated);
      } catch (err) {
        setError('Failed to delete follow-up');
        console.error(err);
        throw err;
      }
    },
    [followUps]
  );

  // Get follow-ups for a specific job
  const getJobFollowUps = useCallback(
    (jobId: string) => {
      return followUps.filter(fu => fu.jobId === jobId);
    },
    [followUps]
  );

  // Get pending follow-ups
  const getPendingFollowUps = useCallback(() => {
    return followUps.filter(fu => fu.status === 'pending');
  }, [followUps]);

  // Mark follow-up as completed
  const completeFollowUp = useCallback(
    async (id: string) => {
      await updateFollowUp(id, { status: 'completed' });
    },
    [updateFollowUp]
  );

  // Load follow-ups on mount
  useEffect(() => {
    loadFollowUps();
  }, [loadFollowUps]);

  return {
    followUps,
    loading,
    error,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp,
    getJobFollowUps,
    getPendingFollowUps,
    completeFollowUp,
    loadFollowUps,
  };
}
