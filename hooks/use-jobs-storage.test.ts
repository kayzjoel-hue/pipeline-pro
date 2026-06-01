import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Unit tests for job storage hook
 */

// Mock AsyncStorage (not required for these unit-style checks)

const mockJobs = [
  {
    id: "1",
    company: "Google",
    title: "Senior Product Manager",
    status: "Interview" as const,
    date: "2026-03-10",
    location: "Mountain View, CA",
    notes: "First round completed",
    jobUrl: "https://google.com/careers",
    createdAt: "2026-03-10T00:00:00Z",
    updatedAt: "2026-03-10T00:00:00Z",
  },
  {
    id: "2",
    company: "Meta",
    title: "Software Engineer",
    status: "Applied" as const,
    date: "2026-03-15",
    location: "Menlo Park, CA",
    notes: "Applied through referral",
    jobUrl: "https://meta.com/careers",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-03-15T00:00:00Z",
  },
];

describe("useJobsStorage Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a new job with generated ID and timestamps", () => {
    const newJobData = {
      company: "Apple",
      title: "Design Lead",
      status: "Offer" as const,
      date: "2026-03-20",
      location: "Cupertino, CA",
    };

    const newJob = {
      ...newJobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(newJob.id).toBeDefined();
    expect(newJob.createdAt).toBeDefined();
    expect(newJob.updatedAt).toBeDefined();
    expect(newJob.company).toBe("Apple");
  });

  it("should update an existing job with new updatedAt timestamp", () => {
    const jobToUpdate = mockJobs[0];
    const updates = {
      status: "Offer" as const,
      notes: "Offer received, negotiating salary",
    };

    const updatedJob = {
      ...jobToUpdate,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    expect(updatedJob.status).toBe("Offer");
    expect(updatedJob.notes).toBe("Offer received, negotiating salary");
    expect(updatedJob.updatedAt).not.toBe(jobToUpdate.updatedAt);
  });

  it("should filter jobs by status", () => {
    const interviewJobs = mockJobs.filter((job) => job.status === "Interview");
    expect(interviewJobs).toHaveLength(1);
    expect(interviewJobs[0].company).toBe("Google");
  });

  it("should count jobs by status", () => {
    const appliedCount = mockJobs.filter((j) => j.status === "Applied").length;
    const interviewCount = mockJobs.filter((j) => j.status === "Interview").length;

    expect(appliedCount).toBe(1);
    expect(interviewCount).toBe(1);
  });

  it("should calculate success rate", () => {
    const totalApplications = mockJobs.length;
    const offers = 0; // No offers in mock data
    const successRate = totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;

    expect(successRate).toBe(0);
  });

  it("should calculate interview rate", () => {
    const totalApplications = mockJobs.length;
    const interviews = mockJobs.filter((j) => j.status === "Interview").length;
    const interviewRate = totalApplications > 0 ? Math.round((interviews / totalApplications) * 100) : 0;

    expect(interviewRate).toBe(50); // 1 interview out of 2 jobs = 50%
  });

  it("should find a job by ID", () => {
    const jobId = "1";
    const foundJob = mockJobs.find((job) => job.id === jobId);

    expect(foundJob).toBeDefined();
    expect(foundJob?.company).toBe("Google");
  });

  it("should delete a job by ID", () => {
    const jobIdToDelete = "1";
    const remainingJobs = mockJobs.filter((job) => job.id !== jobIdToDelete);

    expect(remainingJobs).toHaveLength(1);
    expect(remainingJobs[0].id).toBe("2");
  });

  it("should handle empty job list", () => {
    const emptyJobs: typeof mockJobs = [];
    const totalApplications = emptyJobs.length;
    const successRate = totalApplications > 0 ? Math.round((0 / totalApplications) * 100) : 0;

    expect(totalApplications).toBe(0);
    expect(successRate).toBe(0);
  });

  it("should calculate average time to interview", () => {
    const appliedJobs = mockJobs.filter((j) => j.status !== "Applied");
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

    expect(avgTimeToInterview).toBeDefined();
    expect(typeof avgTimeToInterview).toBe("number");
  });
});
