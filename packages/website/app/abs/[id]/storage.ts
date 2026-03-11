import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Storage abstraction for generated paper assets (MDX + images).
 *
 * Currently backed by the local filesystem (.cache/ directory).
 * Swap implementation to Vercel Blob later — the interface stays the same.
 */

const CACHE_DIR = join(process.cwd(), ".cache", "papers");

function paperDir(id: string): string {
  return join(CACHE_DIR, id);
}

export async function getMdx(id: string): Promise<string | null> {
  const path = join(paperDir(id), "page.mdx");
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf-8");
}

export async function savePaper(
  id: string,
  mdx: string,
  _assets: Array<{ name: string; data: Buffer }> = [],
): Promise<void> {
  const dir = paperDir(id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.mdx"), mdx, "utf-8");

  // TODO: save assets (images) when image pipeline is implemented
  // const assetsDir = join(dir, "assets");
  // mkdirSync(assetsDir, { recursive: true });
  // for (const asset of assets) {
  //   writeFileSync(join(assetsDir, asset.name), asset.data);
  // }
}
