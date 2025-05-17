import { NextResponse } from "next/server";

export function middleware(request) {
  try {
    const path = request.nextUrl.pathname;

    console.log("Middleware path:", path); // Debugging

    // Public path'ler
    const isPublicPath = path === "/login" || path === "/";

    // Token kontrolü
    const token = request.cookies.get("token")?.value || "";

    console.log("Token:", token); // Debugging

    // Eğer protected route ve token yoksa login'e yönlendir
    if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Giriş yapılmışsa ve login sayfasına gidilmeye çalışılırsa income-expense'e yönlendir
    if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/income-expense", request.url));
    }
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.json(
      {
        message: "Middleware error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Middleware'in hangi pathler için çalışacağını belirle
export const config = {
  matcher: ["/", "/login", "/income-expense"],
};
