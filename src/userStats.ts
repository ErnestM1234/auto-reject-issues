import { getOctokit } from "@actions/github";

export interface UserStats {
  username: string;
  publicRepos: number;
  recentCommits: number;
  accountAgeDays: number;
  followers: number;
  following: number;
}

export async function getUserStats(
  octokit: ReturnType<typeof getOctokit>,
  username: string
): Promise<UserStats | null> {
  try {
    console.log("DEBUG: Fetching user stats for:", username);

    // Get user's public profile info
    const userResponse = await octokit.rest.users.getByUsername({
      username: username,
    });

    // Get user's recent events to count commits
    const eventsResponse = await octokit.rest.activity.listPublicEventsForUser({
      username: username,
      per_page: 100,
    });

    const commitEvents = eventsResponse.data.filter(
      (event) => event.type === "PushEvent"
    );
    const recentCommits = commitEvents.reduce((count, event) => {
      // PushEvent payload has commits property
      const payload = event.payload as any;
      return count + (payload?.commits?.length || 0);
    }, 0);

    const accountAgeDays = Math.floor(
      (Date.now() - new Date(userResponse.data.created_at).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const stats: UserStats = {
      username: username,
      publicRepos: userResponse.data.public_repos,
      recentCommits: recentCommits,
      accountAgeDays: accountAgeDays,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
    };

    console.log("DEBUG: User stats gathered:", stats);
    return stats;
  } catch (error) {
    console.log(
      "DEBUG: Failed to get user stats:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

export function formatUserStatsForPrompt(stats: UserStats | null): string {
  if (!stats) {
    return "Unable to fetch user stats";
  }

  return `User: ${stats.username}, Public repos: ${stats.publicRepos}, Recent commits: ${stats.recentCommits}, Account age: ${stats.accountAgeDays} days, Followers: ${stats.followers}, Following: ${stats.following}`;
}