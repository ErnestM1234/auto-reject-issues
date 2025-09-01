import * as core from "@actions/core";
import * as github from "@actions/github";
import { send } from "./response.js";

async function run(): Promise<void> {
  try {
    const token = core.getInput("github-token", { required: true });
    const closingStatementsInput =
      core.getInput("closing-statements") ||
      "nah,not happening,rejected,no thanks,pass";

    const closingStatements = closingStatementsInput
      .split(",")
      .map((statement) => statement.trim());

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== "issues") {
      core.info("This action only runs on issue events");
      return;
    }

    if (context.payload.action !== "opened") {
      core.info("This action only runs when issues are opened");
      return;
    }

    const issue = context.payload.issue;
    if (!issue) {
      core.setFailed("No issue found in context");
      return;
    }

    // Select a random closing statement or use Anthropic API if available
    let randomComment: string | undefined;

    if (process.env.OPENAI_API_KEY) {
      try {
        randomComment = await send(
          `Title: ${issue.title}\nBody: ${
            issue.body || "No description provided"
          }`
        );
        core.info("Generated rejection comment using OpenAI API");
      } catch (error) {
        core.warning(
          `Failed to generate AI comment: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
    if (randomComment === undefined) {
      randomComment =
        closingStatements[Math.floor(Math.random() * closingStatements.length)];
    }

    core.info(`Auto-rejecting issue: ${issue.title}`);

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: randomComment,
    });

    await octokit.rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      state: "closed",
      state_reason: "not_planned",
    });

    core.info(
      `Issue #${issue.number} has been auto-rejected with: "${randomComment}"`
    );
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

run();
