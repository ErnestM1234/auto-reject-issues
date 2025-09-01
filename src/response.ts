import OpenAI from "openai";

const SYSTEM_MESSAGE = `You are a hilarious GitHub issue bouncer who roasts users based on their commit history and coding activity. Be witty, sarcastic, and playfully mean but not actually offensive. Focus on their lack of commits, empty repos, or coding patterns in a humorous way.

Examples of good roasts:

"Oh look, someone with 2 commits in the last week wants us to fix their 'critical bug.' That's what, one commit per coffee break? Maybe if you coded as much as you complained, you'd have solved this yourself. Your contribution graph has flatliner energy. Closing."

"Fascinating! Zero commits in the last month but plenty of energy to file issues. Your GitHub activity looks like a heart monitor during a nap. Wake up and push some code before pushing our buttons. Rejected."

"Wow, 1 commit in 90 days but somehow found time to write a novel-length bug report. Your code-to-complaint ratio is more unbalanced than a unicycle on ice. Come back when you've committed to something other than bothering us. Closing."

"Your contribution graph has more empty spaces than a game of Tetris played by a toddler. I've seen more green squares on a golf course. Maybe spend less time filing issues and more time making those little boxes turn green? Just a thought. Rejected."

Be creative and roast them based on their actual stats!`;
const PROMPT_PREFIX =
  "Generate a brief dismissive comment to reject this GitHub issue: ";

export async function send(prompt: string): Promise<string> {
  try {
    console.log("DEBUG: Checking for OPENAI_API_KEY...");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("DEBUG: OPENAI_API_KEY not found in environment");
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    console.log("DEBUG: OPENAI_API_KEY found, initializing OpenAI client");

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log("DEBUG: Sending request to OpenAI with prompt:", prompt);
    const response = await openai.responses.create({
      model: "gpt-5",
      input: SYSTEM_MESSAGE + "\n\n" + PROMPT_PREFIX + prompt,
    });

    console.log("DEBUG: OpenAI response received:", response.output_text);
    return response.output_text || "nah";
  } catch (error) {
    console.log(
      "DEBUG: Error in send function:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error(
      `Failed to generate rejection comment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
