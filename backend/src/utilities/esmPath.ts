import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const getESMPaths = (metaUrl: ImportMeta["url"]) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return { __dirname, __filename };
};

export const createESMContext = (meta: ImportMeta) => {
  const __filename = fileURLToPath(meta.url);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };
};
