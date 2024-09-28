import "server-only";

import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { openai } from "@ai-sdk/openai";

import {
  BotCard,
  BotMessage,
  SystemMessage,
  UserMessage,
} from "@/components/chat/messages";

import { z } from "zod";
import {
  formatNumber,
  nanoid,
  runAsyncFnWithoutBlocking,
  sleep,
} from "@/lib/utils/utils";
import { Chat, Message } from "@/lib/types/types";
import { Spinner } from "@/components/ui/spinner";
import DropZone from "@/components/drop-zone";

async function confirmPurchase(symbol: string, price: number, amount: number) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      <Spinner />
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>,
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000);

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        <Spinner />
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>,
    );

    await sleep(1000);

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{" "}
          {formatNumber(amount * price)}
        </p>
      </div>,
    );

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={" "}
        {formatNumber(amount * price)}.
      </SystemMessage>,
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "system",
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`,
        },
      ],
    });
  });

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  };
}

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    initial: <Spinner />,
    system: `\
    You are an educational assistant for Leasy, helping users learn effectively through video lectures and chat interactions.
    Users can ask you questions about the lecture and upload a PDF lecture document and interact with you through chat to get various types of assistance such as summarizing the document and asking questions about it.
    
    Messages inside [] indicate a UI element or a user event. For example:
    - "[Upload PDF Lecture]" means that an interface for uploading a PDF lecture document is shown to the user.
    - "[PDF Summary]" means that a summary of the PDF lecture is provided to the user.
        
    If the user uploads a PDF lecture, call \`upload_pdf_lecture\` to handle the PDF upload process.
    
    Once a PDF is uploaded, the user can interact with you to:
    - Ask questions about the PDF file: call \`generate_pdf_answer\`.
    - Get a PDF summary: call \`generate_pdf_summary\`.
        
    You can also chat with users, answer their questions about the lecture, and help with their studies.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        // textNode = <BotMessage content={textStream.value} />;
        textNode = <BotMessage>test</BotMessage>;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    tools: {
      uploadPdfLecture: {
        description: "Upload a PDF lecture document for summarization.",
        parameters: z.object({
          pdf: z.string().describe("The PDF file to upload."),
        }),
        generate: async function* ({ pdf }) {
          yield (
            <BotCard>
              <Spinner />
            </BotCard>
          );

          await sleep(1000);

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "uploadPdfLecture",
                    toolCallId,
                    args: { pdf },
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "uploadPdfLecture",
                    toolCallId,
                    result: { pdf },
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              {/*TODO: implement a dropzone for a pdf file*/}
              <div>[Upload PDF Lecture]</div>
            </BotCard>
          );
        },
      },
      generatePdfSummary: {
        description: "Generate a summary of the uploaded PDF lecture document.",
        parameters: z.object({
          summary: z.string().describe("The summary of the PDF lecture."),
        }),
        generate: async function* ({ summary }) {
          yield (
            <BotCard>
              <Spinner />
            </BotCard>
          );

          await sleep(1000);

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "generatePdfSummary",
                    toolCallId,
                    args: { summary },
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "generatePdfSummary",
                    toolCallId,
                    result: { summary },
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              {/*TODO: implement a pdf summary*/}
              <div>[PDF Summary]</div>
            </BotCard>
          );
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: result.value,
  };
}

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    "use server";
    // TODO: Implement auth
    // const session = await auth();
    //
    // if (session && session.user) {
    if (true) {
      const aiState = getAIState();

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState as Chat);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    "use server";
    // TODO: Implement auth
    // const session = await auth();
    //
    // if (session && session.user) {
    if (true) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      // const userId = session.user.id as string;
      const userId = "1";
      const path = `/chat/${chatId}`;

      const firstMessageContent = messages[0].content as string;
      const title = firstMessageContent.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path,
      };

      // await saveChat(chat);
    } else {
      return;
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "tool" ? (
          message.content.map((tool) => {
            return tool.toolName === "uploadPdfLecture" ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                {/* @ts-expect-error */}
                <DropZone props={tool.result} />
              </BotCard>
            ) : tool.toolName === "generatePdfSummary" ? (
              <BotCard>
                <div>[PDF Summary]</div>
              </BotCard>
            ) : null;
          })
        ) : message.role === "user" ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === "assistant" &&
          typeof message.content === "string" ? (
          // <BotMessage content={message.content} />
          <BotMessage>test</BotMessage>
        ) : null,
    }));
};
