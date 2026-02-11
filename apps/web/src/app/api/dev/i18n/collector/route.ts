import { type NextRequest, NextResponse } from "next/server";

import { writeMissingKeys } from "@meta-1/web-common/utils/i18next.server.writer";

/**
 * 开发环境专用：接收浏览器上传的缺失翻译键，自动补全到 locales 文件
 * 生产环境返回 404
 *
 * 并发安全设计：
 * 1. 使用文件锁防止并发写入
 * 2. 使用临时文件 + 原子重命名
 * 3. 已存在的键不覆盖
 * 4. 按字符排序保障协作冲突最小
 */
export async function POST(request: NextRequest) {
  // 生产环境不接受数据
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "该接口仅在开发环境可用" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { keys } = body as { keys: string[] };

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "无效的请求数据" }, { status: 400 });
    }

    console.log(`[i18n Collector API] 收到 ${keys.length} 个缺失的翻译键，开始写入...`);

    // 写入 locales 文件（并发安全）
    const result = await writeMissingKeys(keys);

    return NextResponse.json({
      success: true,
      message: `成功处理 ${keys.length} 个翻译键`,
      ...result,
    });
  } catch (error) {
    console.error("[i18n Collector API] 处理失败:", error);
    return NextResponse.json({ error: "处理失败", details: String(error) }, { status: 500 });
  }
}

// 仅支持 POST
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "该接口仅在开发环境可用" }, { status: 404 });
  }

  return NextResponse.json({
    message: "i18n Missing Keys Collector API",
    usage: "POST /api/dev/i18n/collector with { keys: string[] }",
    status: "ready",
  });
}
