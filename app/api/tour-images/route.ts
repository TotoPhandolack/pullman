import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

/** Uploaded 360° panoramas live in their own folder, separate from the
 * shared /assets/images used elsewhere on the site — so deleting a scene
 * here can safely remove its file without risking a photo used elsewhere. */
const TOUR_IMAGES_DIR = path.join(process.cwd(), "public", "assets", "tour-360");
const PUBLIC_URL_PREFIX = "/assets/tour-360/";
const FILENAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const MAX_BYTES = 30 * 1024 * 1024; // 30 MB — panoramas can be large

function devOnlyGuard(): Response | null {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "The hotspot editor can only manage images in development." },
      { status: 403 },
    );
  }
  return null;
}

export async function POST(request: Request) {
  const guard = devOnlyGuard();
  if (guard) return guard;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No image file provided." }, { status: 400 });
  }

  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return Response.json(
      { error: "Unsupported image type. Use PNG, JPEG or WebP." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image is larger than 30 MB." }, { status: 400 });
  }

  await mkdir(TOUR_IMAGES_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(TOUR_IMAGES_DIR, filename), bytes);

  return Response.json({ url: `${PUBLIC_URL_PREFIX}${filename}` });
}

export async function DELETE(request: Request) {
  const guard = devOnlyGuard();
  if (guard) return guard;

  const body = await request.json().catch(() => null);
  const url = (body as { url?: unknown } | null)?.url;
  if (typeof url !== "string" || !url.startsWith(PUBLIC_URL_PREFIX)) {
    return Response.json({ error: "Invalid image url." }, { status: 400 });
  }

  const filename = url.slice(PUBLIC_URL_PREFIX.length);
  if (!FILENAME_PATTERN.test(filename)) {
    return Response.json({ error: "Invalid image url." }, { status: 400 });
  }

  try {
    await unlink(path.join(TOUR_IMAGES_DIR, filename));
  } catch (e) {
    // Already gone is fine; anything else surfaces to the caller.
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
      return Response.json({ error: "Could not delete the image file." }, { status: 500 });
    }
  }

  return Response.json({ ok: true });
}
