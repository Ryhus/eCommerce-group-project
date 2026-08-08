import { apiClient } from "../apiClient";

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscription> {
  const response = await apiClient.post<NewsletterSubscription>("/newsletter/subscriptions", { email });
  return response.data;
}
