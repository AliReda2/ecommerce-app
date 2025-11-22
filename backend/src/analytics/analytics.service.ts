import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AnalyticsService {
  private api = axios.create({
    baseURL: process.env.POSTHOG_HOST,
    headers: {
      Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  async getPageviews() {
    const res = await this.api.post(
      `/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`,
      {
        query: {
          kind: 'HogQLQuery',
          query:
            "SELECT count(DISTINCT person_id) AS unique_users FROM events WHERE event = '$pageview'",
        },
      },
    );
    // PostHog returns: results: [[25]]
    const count = res.data.results?.[0]?.[0] ?? 0;

    return { count };
  }

  async getTopProducts() {
    const res = await this.api.post(
      `/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`,
      {
        query: {
          kind: 'HogQLQuery',
          query:
            "SELECT properties->>'productId' AS productId, count() AS views FROM events WHERE event = 'product_view' GROUP BY productId ORDER BY views DESC LIMIT 10",
        },
      },
    );
    return res.data.results;
  }

  async getRevenue() {
    const res = await this.api.post(
      `/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`,
      {
        query: {
          kind: 'HogQLQuery',
          query:
            "SELECT sum((properties->>'amount')::float) AS totalRevenue FROM events WHERE event = 'purchase'",
        },
      },
    );
    return res.data.results[0]?.totalRevenue || 0;
  }
}
