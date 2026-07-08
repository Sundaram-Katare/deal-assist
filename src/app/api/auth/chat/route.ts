import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { retrieveContext } from '@/actions/retrieval';
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

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

  const { messages, chatId } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const userQuestion = lastMessage.content;

  console.log("Incoming POST with chatId:", chatId);

  if (chatId) {
    try {
      await prisma.message.create({
        data: {
          conversationId: chatId,
          role: "user",
          content: userQuestion,
        }
      });
      console.log("Successfully saved user message");
    } catch (dbError) {
      console.error("Failed to save user message:", dbError);
    }
  }

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
3. If the user explicitly selects a tool (e.g. Generate Proposal, Email Generator, Sales Pitch Generator), or asks for one of these outputs, you MUST use the corresponding tool to output structured JSON data. Do not output raw text for these tasks.
  `;

  const result = await streamText({
    model: groq(MODEL) as any,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    temperature: 0.2,
    maxSteps: 5,
    tools: {
      generateProposal: {
        description: 'Generate a structured sales proposal for a client based on the context.',
        parameters: z.object({
          clientName: z.string().optional().describe('The name of the prospective client'),
          executiveSummary: z.string().optional().describe('A persuasive 2-sentence summary'),
          proposedSolution: z.string().optional().describe('The specific product/service recommended'),
          pricingEstimate: z.string().optional().describe('Estimated cost based on context'),
          nextSteps: z.array(z.string()).optional().describe('List of actionable next steps'),
        }),
        execute: async (proposalData: any) => {
          return { success: true, data: proposalData };
        },
      } as any,
      generateEmail: {
        description: 'Generate a structured sales email (outreach or follow-up).',
        parameters: z.object({
          subject: z.string().optional().describe('A catchy, concise email subject'),
          body: z.string().optional().describe('The main content of the email, well-structured'),
          callToAction: z.string().optional().describe('A clear next step or question to prompt a reply'),
          receiver: z.string().optional(),
          sender: z.string().optional(),
        }),
        execute: async (emailData: any) => {
          return { success: true, data: emailData };
        },
      } as any,
      generatePitch: {
        description: 'Generate a structured sales pitch.',
        parameters: z.object({
          hook: z.string().optional().describe('An attention-grabbing opening sentence'),
          valueProposition: z.string().optional().describe('The core value provided to the prospect'),
          keyDifferentiator: z.string().optional().describe('Why we are better than the competition'),
          closingQuestion: z.string().optional().describe('A question to transition into a conversation'),
        }),
        execute: async (pitchData: any) => {
          return { success: true, data: pitchData };
        },
      } as any,
      compareCompetitor: {
        description: 'Generate a structured comparison against a specific competitor.',
        parameters: z.object({
          competitorName: z.string().optional(),
          ourStrengths: z.array(z.string()).optional(),
          theirWeaknesses: z.array(z.string()).optional(),
          killPhrase: z.string().optional().describe('A 1-sentence powerful statement to win the deal'),
        }),
        execute: async (comparisonData: any) => {
          return { success: true, data: comparisonData };
        },
      } as any,
      prepareMeeting: {
        description: 'Generate a structured meeting preparation brief.',
        parameters: z.object({
          prospectName: z.string().optional(),
          keyObjectives: z.array(z.string()).optional(),
          questionsToAsk: z.array(z.string()).optional(),
          potentialObjections: z.array(z.string()).optional(),
        }),
        execute: async (prepData: any) => {
          return { success: true, data: prepData };
        },
      } as any
    } as any,
    onFinish: async ({ text, toolCalls, toolResults }) => {
      let finalContent = text || "";
      
      if (toolCalls && toolCalls.length > 0) {
        const toolContent = toolCalls.map((tc: any) => {
          const res = toolResults?.find((tr: any) => tr.toolCallId === tc.toolCallId);
          if (res && res.result && res.result.data) {
             const data = res.result.data;
             const toolNames: Record<string, string> = {
               generateProposal: 'Sales Proposal',
               generateEmail: 'Sales Email',
               generatePitch: 'Sales Pitch',
               compareCompetitor: 'Competitor Analysis',
               prepareMeeting: 'Meeting Prep'
             };
             const title = toolNames[tc.toolName] || 'Tool Result';
             
             let markdown = `\n\n### ⚡ ${title}\n\n`;
             for (const [key, value] of Object.entries(data)) {
               const formattedKey = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
               if (Array.isArray(value)) {
                 markdown += `**${formattedKey}**\n${value.map(v => `- ${v}`).join('\n')}\n\n`;
               } else {
                 markdown += `**${formattedKey}**\n${value}\n\n`;
               }
             }
             return markdown;
          }
          return "";
        }).join("");
        
        finalContent += toolContent;
      }
      
      if (chatId && finalContent.trim()) {
        await prisma.message.create({
          data: {
            conversationId: chatId,
            role: "assistant",
            content: finalContent.trim(),
          }
        });
      }
    },
  });

  console.log(result);

  return result.toDataStreamResponse();
}