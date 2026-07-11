import { NextRequest, NextResponse } from "next/server";

export async function withLogging(
  request: NextRequest,
  handler: () => Promise<NextResponse>
) {
  const start = performance.now();

  try {
    const response = await handler();

    console.log(
      `${request.method} ${request.nextUrl.pathname} ${
        response.status
      } ${Math.round(performance.now() - start)}ms`
    );

    return response;
  } catch (error) {
    console.error(
      `${request.method} ${request.nextUrl.pathname} ERROR ${Math.round(
        performance.now() - start
      )}ms`
    );

    throw error;
  }
}
