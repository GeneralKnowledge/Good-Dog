"use server";

import { HELP_ARTICLES, searchHelp } from "@/lib/domains/dog-training";
import { answerFromGlossary } from "@/lib/content/terminology-answers";
import { getPublishedGlossary } from "@/lib/content/glossary";
import { requireUser } from "@/lib/auth/session";

export type AskResult =
  | { ok: true; answer: string; source: "glossary" | "help" | "ai" }
  | { ok: false; error: string };

export async function askOptionalAiAction(input: {
  question: string;
  dogName: string;
}): Promise<AskResult> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Please sign in first" };

  const question = input.question.trim();
  if (!question) return { ok: false, error: "Enter a question first" };

  // Prefer reviewed glossary definitions for terminology questions
  const glossaryHit = answerFromGlossary(question, input.dogName);
  if (glossaryHit) {
    return { ok: true, answer: glossaryHit.answer, source: "glossary" };
  }

  const localMatches = searchHelp(question);
  const fallback =
    localMatches[0]?.answer ??
    HELP_ARTICLES.find((a) => a.id === "help-worried")?.answer ??
    "Keep sessions short, kind, and easy. If your dog seems worried, pause and simplify.";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      ok: true,
      answer: fallback.replace(/\byour dog\b/gi, input.dogName),
      source: "help",
    };
  }

  try {
    const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const helpKnowledge = HELP_ARTICLES.map(
      (a) => `Q: ${a.question}\nA: ${a.answer}`,
    ).join("\n\n");
    const glossaryKnowledge = getPublishedGlossary()
      .map(
        (t) =>
          `TERM: ${t.preferredTerm} (id:${t.id})\nDEF: ${t.shortDefinition}\nDEEPER: ${t.deeperExplanation}\nEXAMPLE: ${t.example}${
            t.commonMisunderstanding
              ? `\nMISUNDERSTANDING: ${t.commonMisunderstanding}`
              : ""
          }`,
      )
      .join("\n\n");

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `You are Good Dog’s optional helper for UK dog owners. Use ONLY the approved guidance and glossary provided. British English. Reward-based, force-free. Never invent veterinary diagnoses, credentials, endorsements, or guaranteed outcomes. If the topic involves biting, severe aggression, severe fear, pain, illness, or sudden behaviour change, advise seeking a vet or qualified reward-based professional. Prefer small practical next steps.

When the owner asks about a training term that appears in the approved glossary, you MUST use that definition (do not invent a conflicting one). Explain in plain English first, then name the term. Dog name: ${input.dogName}.

Approved help:
${helpKnowledge}

Approved glossary:
${glossaryKnowledge}`,
          },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      return {
        ok: true,
        answer: `${fallback.replace(/\byour dog\b/gi, input.dogName)} (AI helper unavailable just now — showing approved guidance.)`,
        source: "help",
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return {
        ok: true,
        answer: fallback.replace(/\byour dog\b/gi, input.dogName),
        source: "help",
      };
    }
    return { ok: true, answer: content, source: "ai" };
  } catch {
    return {
      ok: true,
      answer: `${fallback.replace(/\byour dog\b/gi, input.dogName)} (AI helper unavailable — showing approved guidance.)`,
      source: "help",
    };
  }
}
