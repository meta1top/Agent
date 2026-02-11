import { type NextRequest, NextResponse } from "next/server";

// 运行时获取 API_URL
const getApiUrl = () => {
  return (process.env.API_URL || "").replace(/\/$/, "");
};

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiUrl = getApiUrl();

  if (!apiUrl) {
    console.error("API proxy error: API_URL not configured");
    return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
  }

  const targetPath = path.join("/");
  const targetUrl = new URL(`/api/${targetPath}`, apiUrl);

  // 复制查询参数
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // 准备请求头
  const headers = new Headers(request.headers);
  // 移除 host 头，让它使用目标服务器的 host
  headers.delete("host");

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.body,
      // @ts-expect-error duplex is needed for streaming
      duplex: "half",
    });

    // 创建响应，复制所有头部
    const responseHeaders = new Headers(response.headers);
    // 移除一些不应该传递的头部
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("API proxy error:", {
      error,
      targetUrl: targetUrl.toString(),
      method: request.method,
      path: targetPath,
    });
    return NextResponse.json({ code: 500, message: "Internal server error" }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
