import { readdir, readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const files = [
  "dist/index.html",
  ...(await readdir("dist/assets")).map((f) => "dist/assets/" + f),
];
const sizes = await Promise.all(
  files.map(async (path) => {
    const b = await readFile(path);
    return { path, bytes: b.length, gzipBytes: gzipSync(b).length };
  }),
);
await writeFile(
  "artifacts/build-size.json",
  JSON.stringify(
    {
      files: sizes,
      totalBytes: sizes.reduce((s, x) => s + x.bytes, 0),
      runtimePackages: 0,
      note: "Built app files only; preserved autumn reference and copied documentation are separate, not requested on initial Lab load.",
    },
    null,
    2,
  ) + "\n",
);
