import { ZodError } from "zod";

export function prepareInsertParts<T extends object>(
  obj: T,
  exclude: (keyof T)[] = [],
) {
  const keys = Object.keys(obj).filter(
    (key) =>
      obj[key as keyof T] != undefined && !exclude.includes(key as keyof T),
  );

  const values = keys.map((key) => obj[key as keyof T]);

  const placeholder = keys.map((_, index) => `$${index + 1}`).join(",");
  return { keys, values, placeholder };
}

export function formatZodError(error: ZodError) {
  return error.errors
    .map((e) => {
      const field = e.path.join(".");
      const message = e.message;
      return `${field}: ${message}`;
    })
    .join("; ");
}
