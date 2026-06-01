import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Job data type
 */
export interface Job {
  id: string;
  company: string;
  title: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  date: string; // ISO date string
  location?: string;
  salary?: string;
  notes?: string;
  jobUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const JOBS_STORAGE_KEY = "pipeline_pro_jobs";

/**
 * Hook to manage job data with AsyncStorage persistence
 */
export function useJobsStorage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all jobs from AsyncStorage
   */
  const loadJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedJobs = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      } else {
        // Initialize with sample data if no jobs exist
        const sampleJobs = getDefaultJobs();
        setJobs(sampleJobs);
        await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(sampleJobs));
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
      console.error("Error loading jobs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load jobs from storage on mount
  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  /**
   * Add a new job
   */
  const addJob = useCallback(
    async (jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
      try {
        const newJob: Job = {
          ...jobData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedJobs = [...jobs, newJob];
        setJobs(updatedJobs);
        await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
        return newJob;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to add job";
        setError(errorMsg);
        throw err;
      }
    },
    [jobs]
  );

  /**
   * Update an existing job
   */
  const updateJob = useCallback(
    async (id: string, updates: Partial<Omit<Job, "id" | "createdAt">>) => {
      try {
        const updatedJobs = jobs.map((job) =>
          job.id === id
            ? {
                ...job,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : job
        );

        setJobs(updatedJobs);
        await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update job";
        setError(errorMsg);
        throw err;
      }
    },
    [jobs]
  );

  /**
   * Delete a job
   */
  const deleteJob = useCallback(
    async (id: string) => {
      try {
        const updatedJobs = jobs.filter((job) => job.id !== id);
        setJobs(updatedJobs);
        await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete job";
        setError(errorMsg);
        throw err;
      }
    },
    [jobs]
  );

  /**
   * Get a single job by ID
   */
  const getJob = useCallback(
    (id: string) => {
      return jobs.find((job) => job.id === id);
    },
    [jobs]
  );

  /**
   * Clear all jobs (for testing/reset)
   */
  const clearAll = useCallback(async () => {
    try {
      setJobs([]);
      await AsyncStorage.removeItem(JOBS_STORAGE_KEY);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to clear jobs";
      setError(errorMsg);
      throw err;
    }
  }, []);

  return {
    jobs,
    isLoading,
    error,
    addJob,
    updateJob,
    deleteJob,
    getJob,
    loadJobs,
    clearAll,
  };
}

/**
 * Default sample jobs for initial setup
 */
function getDefaultJobs(): Job[] {
  const now = new Date().toISOString();
  return [
    {
      id: "1",
      company: "Google",
      title: "Senior Product Manager",
      status: "Interview",
      date: "2026-03-10",
      location: "Mountain View, CA",
      notes: "First round completed, waiting for second round",
      jobUrl: "https://google.com/careers",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      company: "Meta",
      title: "Software Engineer",
      status: "Applied",
      date: "2026-03-15",
      location: "Menlo Park, CA",
      notes: "Applied through referral",
      jobUrl: "https://meta.com/careers",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "3",
      company: "Apple",
      title: "Design Lead",
      status: "Rejected",
      date: "2026-03-05",
      location: "Cupertino, CA",
      notes: "Rejected after final interview",
      jobUrl: "https://apple.com/careers",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "4",
      company: "Microsoft",
      title: "Product Manager",
      status: "Offer",
      date: "2026-03-01",
      location: "Seattle, WA",
      salary: "$180k-220k",
      notes: "Offer received, negotiating salary",
      jobUrl: "https://microsoft.com/careers",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "5",
      company: "Amazon",
      title: "Senior Engineer",
      status: "Interview",
      date: "2026-03-12",
      location: "Seattle, WA",
      notes: "Scheduled for technical interview",
      jobUrl: "https://amazon.com/careers",
      createdAt: now,
      updatedAt: now,
    },
  ];
}
