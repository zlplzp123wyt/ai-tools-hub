import { NextRequest, NextResponse } from "next/server";

const STYLE_MAP: Record<string, string> = {
  academic: "学术正式风格，用词严谨，适合论文",
  natural: "自然流畅风格，像人类写作",
  simple: "简洁易懂风格，降低复杂度",
};

const LEVEL_MAP: Record<string, string> = {
  light: "轻度改写：保持原文结构，只替换同义词和调整语序",
  medium: "中度改写：重组句子结构，合并或拆分句子，替换表达方式",
  heavy: "深度改写：完全重写，保持核心意思但大幅改变表达方式",
};

// 智谱 AI 调用
async function callZhipu(apiKey: string, prompt: string): Promise<string> {
  // 智谱使用 HMAC-SHA256 认证，但也可以直接用 API Key
  const res = await fetch(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.8,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("Zhipu API error:", err);
    throw new Error("AI服务暂时不可用");
  }

  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

// DeepSeek 调用
async function callDeepSeek(
  apiKey: string,
  prompt: string
): Promise<string> {
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("DeepSeek API error:", err);
    throw new Error("AI服务暂时不可用");
  }

  const data = await res.json();
  return data.choices[0]?.message?.content?.trim() || "";
}

export async function POST(req: NextRequest) {
  try {
    const { text, style = "academic", level = "medium" } = await req.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "请输入至少10个字" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "单次最多10000字，请分段处理" },
        { status: 400 }
      );
    }

    const prompt = `你是一个专业的论文降重助手。请对以下文本进行改写，降低与原文的相似度，同时保持原意不变。

改写要求：
- ${LEVEL_MAP[level] || LEVEL_MAP.medium}
- 风格：${STYLE_MAP[style] || STYLE_MAP.academic}
- 保持专业术语不变
- 保持逻辑结构清晰
- 改写后的文本应该与原文意思一致但表达方式明显不同
- 直接输出改写后的文本，不要加任何解释或前缀

原文：
${text}`;

    // 优先用智谱，备选 DeepSeek
    const zhipuKey = process.env.ZHIPU_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    let result: string;

    if (zhipuKey) {
      result = await callZhipu(zhipuKey, prompt);
    } else if (deepseekKey) {
      result = await callDeepSeek(deepseekKey, prompt);
    } else {
      return NextResponse.json(
        { error: "服务未配置，请联系管理员" },
        { status: 500 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: "AI未返回结果，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("Rewrite error:", err);
    return NextResponse.json(
      { error: err.message || "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
