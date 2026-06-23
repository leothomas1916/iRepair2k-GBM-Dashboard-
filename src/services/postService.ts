/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GBPPost, GeneratorConfig } from "../types";

export async function generateGBPPost(config: GeneratorConfig): Promise<GBPPost> {
  const response = await fetch("/api/generate-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ config }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate post");
    } else {
      const text = await response.text();
      throw new Error(`Server returned non-JSON (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  return response.json();
}

/**
 * Image generation via Pollinations.ai
 * For now, mostly used to fetch a generated image URL if the backend implements it.
 */
export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image");
    } else {
      const text = await response.text();
      throw new Error(`Server returned non-JSON (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  const data = await response.json();
  return data.url;
}
