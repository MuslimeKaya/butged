import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db, collection, query, where, getDocs } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log("Login attempt:", { username }); // Debugging

    // Users koleksiyonunda sorgu
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("username", "==", username),
      where("password", "==", password)
    );

    try {
      const querySnapshot = await getDocs(q);

      console.log("Query result:", querySnapshot.size); // Debugging

      if (!querySnapshot.empty) {
        // Token oluştur ve cookie'ye kaydet
        cookies().set("token", "dummy-auth-token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return NextResponse.json(
          {
            message: "Login successful",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Invalid credentials",
          },
          { status: 401 }
        );
      }
    } catch (firestoreError) {
      console.error("Firestore Error:", firestoreError);
      return NextResponse.json(
        {
          message: "Firestore error",
          error: firestoreError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
