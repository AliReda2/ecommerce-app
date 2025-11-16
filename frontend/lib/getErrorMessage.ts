// lib/utils/getErrorMessage.ts
export const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as any;
    return axiosErr.response?.data?.message || "An error occurred";
  }
  return err instanceof Error ? err.message : "An error occurred";
};
