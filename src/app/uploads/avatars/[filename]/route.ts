import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AVATAR_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const AVATAR_FILENAME_PATTERN = /^[a-zA-Z0-9_-]+\.(?:jpg|png|webp)$/;
const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!AVATAR_FILENAME_PATTERN.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(AVATAR_UPLOAD_DIR, filename));
    const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()];

    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
        "Content-Length": String(file.byteLength),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
