import Link from "next/link";

const tools = [
  {
    id: "rewrite",
    name: "论文降重",
    desc: "AI智能改写，降低查重率",
    icon: "📝",
    hot: true,
    href: "/rewrite",
  },
  {
    id: "resume",
    name: "简历优化",
    desc: "AI分析简历，一键优化",
    icon: "📄",
    hot: false,
    href: "/resume",
  },
  {
    id: "copywriting",
    name: "电商文案",
    desc: "一键生成产品标题和详情",
    icon: "🛒",
    hot: false,
    href: "/copywriting",
  },
  {
    id: "contract",
    name: "合同审查",
    desc: "AI审查合同条款，标注风险",
    icon: "📋",
    hot: false,
    href: "/contract",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI 效率工具箱
          </h1>
          <p className="text-lg text-gray-600">
            让 AI 帮你提升效率，节省时间
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 hover:border-blue-200"
            >
              {tool.hot && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  🔥 热门
                </span>
              )}
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {tool.name}
              </h2>
              <p className="text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm">
          每日免费使用 3 次 · 升级会员无限使用
        </div>
      </div>
    </main>
  );
}
