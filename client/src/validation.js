// src/validation.js
import { z } from 'zod';

/** 1) Define your Todo schema */
export const TodoSchema = z.object({
  title:       z.string().min(1, "Title is required"),        // non‑empty :contentReference[oaicite:1]{index=1}
  description: z.string().min(1, "Description is required"),  // non‑empty :contentReference[oaicite:2]{index=2}
  isCompleted: z.boolean().optional().default(false),
});

/** 2) A reusable “middleware” that: 
 *   - runs safeParse (no throw)
 *   - alerts all error messages
 *   - only invokes your handler when valid
 */
export function withValidation(schema, handler) {
  return async (data) => {
    const result = schema.safeParse(data);                    // safeParse returns { success, error } :contentReference[oaicite:3]{index=3}
    if (!result.success) {
      // flatten fieldErrors into a single string
      const errs = Object.values(result.error.flatten().fieldErrors)
                        .flat()
                        .filter(Boolean)
                        .join("\n");
      alert(errs);                                            // show user each missing/invalid field
      return;
    }
    return handler(result.data);
  };
}
