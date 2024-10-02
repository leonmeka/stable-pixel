import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      let base64String = reader.result as string;

      if (base64String.startsWith("data:image")) {
        base64String = base64String.split(",")[1]!;
      }

      base64String =
        base64String + "=".repeat((4 - (base64String.length % 4)) % 4);

      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
