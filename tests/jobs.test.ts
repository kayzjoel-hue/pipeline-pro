import { describe, it, expect } from "vitest";

/**
 * Unit tests for Job List sorting functionality
 */

// Mock job data
const mockJobs = [
  { id: 1, company: "Google", title: "Senior Product Manager", status: "Interview", date: "2026-03-10" },
  { id: 2, company: "Meta", title: "Software Engineer", status: "Applied", date: "2026-03-15" },
  { id: 3, company: "Apple", title: "Design Lead", status: "Rejected", date: "2026-03-05" },
  { id: 4, company: "Microsoft", title: "Product Manager", status: "Offer", date: "2026-03-01" },
  { id: 5, company: "Amazon", title: "Senior Engineer", status: "Interview", date: "2026-03-12" },
];

// Status order mapping
const statusOrder: Record<string, number> = {
  Applied: 1,
  Interview: 2,
  Offer: 3,
  Rejected: 4,
};

describe("Job List Sorting", () => {
  it("should sort jobs by date (newest first)", () => {
    const sorted = [...mockJobs].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    expect(sorted[0].company).toBe("Meta"); // 2026-03-15
    expect(sorted[1].company).toBe("Amazon"); // 2026-03-12
    expect(sorted[2].company).toBe("Google"); // 2026-03-10
    expect(sorted[3].company).toBe("Apple"); // 2026-03-05
    expect(sorted[4].company).toBe("Microsoft"); // 2026-03-01
  });

  it("should sort jobs by status order (Applied -> Interview -> Offer -> Rejected)", () => {
    const sorted = [...mockJobs].sort((a, b) => {
      const statusA = statusOrder[a.status] || 0;
      const statusB = statusOrder[b.status] || 0;
      return statusA - statusB;
    });

    expect(sorted[0].status).toBe("Applied"); // Meta
    expect(sorted[1].status).toBe("Interview"); // Google or Amazon
    expect(sorted[2].status).toBe("Interview"); // Google or Amazon
    expect(sorted[3].status).toBe("Offer"); // Microsoft
    expect(sorted[4].status).toBe("Rejected"); // Apple
  });

  it("should filter jobs by search query", () => {
    const searchQuery = "google";
    const filtered = mockJobs.filter(
      (job) =>
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].company).toBe("Google");
  });

  it("should filter jobs by status", () => {
    const filterStatus = "Interview";
    const filtered = mockJobs.filter((job) => job.status === filterStatus);

    expect(filtered).toHaveLength(2);
    expect(filtered.every((job) => job.status === "Interview")).toBe(true);
  });

  it("should combine filtering and sorting", () => {
    const searchQuery = "";
    const filterStatus = "all";
    const sortBy = "status";

    const result = mockJobs
      .filter((job) => {
        const matchesSearch =
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || job.status === filterStatus;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "status") {
          const statusA = statusOrder[a.status] || 0;
          const statusB = statusOrder[b.status] || 0;
          return statusA - statusB;
        } else {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });

    expect(result).toHaveLength(5);
    expect(result[0].status).toBe("Applied");
    expect(result[1].status).toBe("Interview");
    expect(result[2].status).toBe("Interview");
    expect(result[3].status).toBe("Offer");
    expect(result[4].status).toBe("Rejected");
  });

  it("should handle empty filter results", () => {
    const filterStatus = "NonExistent";
    const filtered = mockJobs.filter((job) => job.status === filterStatus);

    expect(filtered).toHaveLength(0);
  });
});
