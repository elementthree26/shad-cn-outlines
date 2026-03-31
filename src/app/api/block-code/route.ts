import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  const blockId = request.nextUrl.searchParams.get("id");
  if (!blockId || !/^[a-z0-9]+$/.test(blockId)) {
    return Response.json({ error: "Invalid block ID" }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), "src", "blocks", `${blockId}.tsx`);
    const code = await readFile(filePath, "utf-8");
    return Response.json({ id: blockId, code });
  } catch {
    return Response.json({ error: "Block not found" }, { status: 404 });
  }
}
