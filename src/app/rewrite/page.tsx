"use client";

import { useState } from "react";

export default function RewritePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("academic");
  const [level, setLevel] = useState("medium");

  const handleRewrite = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, style, level }),
      });

      const data = await res.json();
      if (data.error) {
        setOutput("❌ " + data.error);
      } else {
        setOutput(data.result);
      }
    } catch {
      setOutput("❌ 网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <a href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          ← 返回首页
        </a>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📝 AI 论文降重
        </h1>
        <p className="text-gray-500 mb-8">
          粘贴你的论文段落，AI 帮你智能改写，降低查重率
        </p>

        {/* Options */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">改写风格</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="academic">学术正式</option>
              <option value="natural">自然流畅</option>
              <option value="simple">简洁易懂</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">改写程度</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="light">轻度改写</option>
              <option value="medium">中度改写</option>
              <option value="heavy">深度改写</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              原文
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴需要降重的论文段落..."
              className="w-full h-80 border border-gray-300 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {input.length} 字
              </span>
              <button
                onClick={handleRewrite}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "改写中..." : "✨ 开始降重"}
              </button>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                改写结果
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 hover:underline"
                >
                  📋 复制
                </button>
              )}
            </div>
            <div className="w-full h-80 border border-gray-200 rounded-xl p-4 text-sm bg-gray-50 overflow-auto whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="animate-spin mr-2">⏳</div>
                  AI 正在改写...
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-gray-300">改写结果将显示在这里...</span>
              )}
            </div>
            {output && (
              <div className="text-xs text-gray-400 mt-2">
                {output.length} 字
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
