import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //   const auth = request.headers.get("authorization");
  //   if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
  //     return new NextResponse("Unauthorized", { status: 401 });
  //   }

  try {
    revalidatePath("/sitemap.xml");
    return new NextResponse("Sitemap revalidated", { status: 200 });
  } catch (err) {
    return new NextResponse("Failed to revalidate", { status: 500 });
  }
}
