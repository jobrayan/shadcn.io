"use client";

import * as React from "react";
import { useState } from "react";
import { Conversation } from "@/components/ai/conversation";
import {
  ConversationItem,
  ConversationItemHeader,
  ConversationItemFooter,
} from "@/components/ai/conversation-item";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from "@/components/ai/prompt-input";
import { Response } from "@/components/ai/response";
import { Sources } from "@/components/ai/sources";
import { Tool } from "@/components/ai/tool";
import { Reasoning } from "@/components/ai/reasoning";
import { InlineCitation } from "@/components/ai/inline-citation";
import { AssistantActions } from "@/components/ai/assistant-actions";
import { MessageSelectionBar } from "@/components/ai/message-selection-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { MicIcon, PaperclipIcon } from "lucide-react";

interface ChatItem {
  id: string;
  role: "user" | "assistant";
  md: string;
  reasoning?: string;
  sources?: { title: string; url?: string; description?: string }[];
  tool?: { name: string; status: "pending" | "success" | "error"; output: unknown };
  model?: string;
  time?: string;
}

const MODELS = [
  { id: "gpt-4o-mini", name: "GPT-4o mini" },
  { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

export default function Page() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming" | "error">("ready");
  const [items, setItems] = useState<ChatItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string, on: boolean) =>
    setSelected((s) => (on ? [...new Set([...s, id])] : s.filter((x) => x !== id)));

  const selectAll = () => setSelected(items.map((m) => m.id));
  const clear = () => setSelected([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const user: ChatItem = {
      id: crypto.randomUUID(),
      role: "user",
      md: text,
      model,
      time: new Date().toLocaleTimeString(),
    };
    setItems((prev) => [...prev, user]);
    setInput("");
    setStatus("submitted");

    const id = crypto.randomUUID();
    const start = Date.now();
    const assistant: ChatItem = {
      id,
      role: "assistant",
      md: "",
      reasoning: "Thinking…",
      sources: [
        { title: "ui.shadcn.com — Components", url: "https://ui.shadcn.com/docs/components" },
        { title: "shadcn.io — AI Elements", url: "https://www.shadcn.io/ai" },
      ],
      tool: { name: "web.search", status: "pending", output: { q: text } },
      model,
      time: new Date().toLocaleTimeString(),
    };
    setItems((prev) => [...prev, assistant]);
    setStatus("streaming");

    const chunks = [
      `Here is what I found about **${text}**.\n\n`,
      `You can use the official CLI for primitives <Inline>[1]</Inline> and the AI Elements registry for chat UIs <Inline>[2]</Inline>.\n\n`,
      "```bash\npnpm dlx shadcn@latest add button input dialog\n```\n",
    ];

    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 500));
      setItems((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                md: m.md + chunk,
                reasoning: `Thinking for ${((Date.now() - start) / 1000) | 0}s…`,
              }
            : m
        )
      );
    }

    await new Promise((r) => setTimeout(r, 400));
    setItems((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              tool: { name: "web.search", status: "success", output: { hits: 2 } },
              reasoning: "Complete.",
            }
          : m
      )
    );
    setStatus("ready");
  };

  const renderMd = (md: string) => md.replaceAll("<Inline>", "").replaceAll("</Inline>", "");

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">AI Chat Demo</h1>
      <div className="relative">
        <Conversation className="rounded-xl border bg-muted/30 p-2">
          {items.map((m) => {
            const isChecked = selected.includes(m.id);
            return (
              <div key={m.id} className="relative group">
                <div className="absolute -left-6 top-4">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(v) => toggle(m.id, Boolean(v))}
                    aria-label="Select message"
                  />
                </div>
                <ConversationItem
                  role={m.role}
                  avatar={{ name: m.role === "user" ? "You" : "AI" }}
                  header={
                    <ConversationItemHeader>
                      {m.model ?? model} • {m.time}
                    </ConversationItemHeader>
                  }
                  footer={
                    <ConversationItemFooter>
                      <Sources items={m.sources || []} />
                      {m.role === "assistant" && (
                        <AssistantActions
                          onCopy={() => navigator.clipboard.writeText(m.md)}
                          onDelete={() =>
                            setItems((prev) => prev.filter((i) => i.id !== m.id))
                          }
                        />
                      )}
                    </ConversationItemFooter>
                  }
                  className="group"
                >
                  {m.role === "assistant" && (
                    <>
                      <Reasoning
                        state={m.reasoning === "Complete." ? "complete" : "thinking"}
                        text={m.reasoning}
                      />
                      <Response content={renderMd(m.md)} className="[&_code]:text-xs" />
                      {m.md.includes("[1]") && (
                        <div className="mt-2 flex gap-2">
                          <InlineCitation
                            index={1}
                            title="ui.shadcn.com — Components"
                            url="https://ui.shadcn.com/docs/components"
                            snippet="Official component primitives and docs."
                            iconUrl="https://ui.shadcn.com/favicon.ico"
                          />
                          <InlineCitation
                            index={2}
                            title="shadcn.io — AI Elements"
                            url="https://www.shadcn.io/ai"
                            snippet="Community registry for chat/AI UI."
                            iconUrl="https://www.shadcn.io/favicon.ico"
                          />
                        </div>
                      )}
                      {m.tool && (
                        <div className="mt-2">
                          <Tool name={m.tool.name} status={m.tool.status}>
                            <pre>{JSON.stringify(m.tool.output, null, 2)}</pre>
                          </Tool>
                        </div>
                      )}
                    </>
                  )}
                  {m.role === "user" && <div>{m.md}</div>}
                </ConversationItem>
              </div>
            );
          })}
        </Conversation>
        <MessageSelectionBar
          totalCount={items.length}
          selectedIds={selected}
          onSelectAll={selectAll}
          onClear={clear}
          onBulkCopy={() => {
            const text = items
              .filter((m) => selected.includes(m.id))
              .map((m) => m.md)
              .join("\n\n---\n\n");
            navigator.clipboard.writeText(text);
          }}
          onBulkDelete={() => {
            setItems((prev) => prev.filter((m) => !selected.includes(m.id)));
            clear();
          }}
        />
      </div>
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Ask about shadcn components…"
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <PaperclipIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <MicIcon size={16} />
              <span>Voice</span>
            </PromptInputButton>
            <PromptInputModelSelect value={model} onValueChange={setModel}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {MODELS.map((m) => (
                  <PromptInputModelSelectItem key={m.id} value={m.id}>
                    {m.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!input.trim()} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}

