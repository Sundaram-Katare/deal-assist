import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { retrieveContext } from '@/actions/retrieval';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama3-8b-8192";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    return new Response('Unauthorized: User must belong to an organization.', { status: 401 });
  }

  const userId = session.user.id;
  const orgId = membership.orgId;

  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const userQuestion = lastMessage.content;

  // RAG: Retrieve context
  let context = "";
  try {
    context = await retrieveContext(userQuestion);
  } catch (error) {
    console.error("Context retrieval error:", error);
  }

  const systemPrompt = `
You are an elite AI Sales Copilot. Your goal is to help sales reps close deals.
You have access to internal company documents.

CONTEXT:
${context}

INSTRUCTIONS:
1. Product Q&A: Answer directly based on CONTEXT.
2. Objection Handling: Use the "Feel, Felt, Found" framework based on CONTEXT.
3. If the user asks for a proposal, competitor comparison, or meeting prep, you MUST use the provided tools to output structured JSON data. Do not output raw text for these tasks.
  `;

  const result = await streamText({
    model: groq(MODEL) as any,
    system: systemPrompt,
    messages: messages as any[],
    temperature: 0.2,
    tools: {
      generateProposal: {
        description: 'Generate a structured sales proposal for a client based on the context.',
        parameters: z.object({
          clientName: z.string().describe('The name of the prospective client'),
          executiveSummary: z.string().describe('A persuasive 2-sentence summary'),
          proposedSolution: z.string().describe('The specific product/service recommended'),
          pricingEstimate: z.string().describe('Estimated cost based on context'),
          nextSteps: z.array(z.string()).describe('List of actionable next steps'),
        }),
        execute: async (proposalData: any) => {
          return {
            success: true,
            message: "Proposal generated successfully in structured format.",
            data: proposalData
          };
        },
      } as any,
      compareCompetitor: {
        description: 'Generate a structured comparison against a specific competitor.',
        parameters: z.object({
          competitorName: z.string(),
          ourStrengths: z.array(z.string()),
          theirWeaknesses: z.array(z.string()),
          killPhrase: z.string().describe('A 1-sentence powerful statement to win the deal'),
        }),
        execute: async (comparisonData: any) => {
          return { success: true, data: comparisonData };
        },
      } as any,
      prepareMeeting: {
        description: 'Generate a structured meeting preparation brief.',
        parameters: z.object({
          prospectName: z.string(),
          keyObjectives: z.array(z.string()),
          questionsToAsk: z.array(z.string()),
          potentialObjections: z.array(z.string()),
        }),
        execute: async (prepData: any) => {
          return { success: true, data: prepData };
        },
      } as any
    } as any,
  });

  return (result as any).toTextStreamResponse ? (result as any).toTextStreamResponse() : (result as any).toAIStreamResponse ? (result as any).toAIStreamResponse() : (result as any).toDataStreamResponse();
}