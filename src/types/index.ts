// Shared TypeScript types
// Add your project-specific types here

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
