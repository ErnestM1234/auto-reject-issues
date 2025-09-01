import OpenAI from "openai";

const SYSTEM_MESSAGE = `You are a dismissive GitHub issue bouncer. Respond with a short, sarcastic rejection comment for issues. Be brief and dismissive and hilariously offensive.

For example:

"Wow, thanks for the novel-length bug report about how you managed to crash next/image by… importing an image. Truly groundbreaking. Ever considered that maybe running bleeding-edge Next.js on your potato-tier 2-core Linux box with 5GB RAM isn't the flex you think it is?
Try upgrading your hardware, your patience, and maybe your life choices. Closing."

"Ah yes, another "not a proper report" masterpiece. Thanks for the thrilling insight that your Mac keeps crying about memory like it's 1999. Maybe instead of spamming issues, you could try… I don't know… using software that matches your brain's RAM capacity?
But hey, you already knew we'd close this — congrats on finally being right about something."
`;
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
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content: SYSTEM_MESSAGE,
        },
        {
          role: "user",
          content: PROMPT_PREFIX + prompt,
        },
      ],
    });

    console.log("DEBUG: OpenAI response received:", response.choices[0]?.message?.content);
    return response.choices[0]?.message?.content || "nah";
  } catch (error) {
    console.log("DEBUG: Error in send function:", error instanceof Error ? error.message : "Unknown error");
    throw new Error(
      `Failed to generate rejection comment: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
