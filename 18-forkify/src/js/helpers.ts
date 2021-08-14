import { TIMEOUT_SECONDS } from "./config";

import * as mathjs from "mathjs";

export function toFraction(value: string | number): string {
  value = Number(value);
  if (Number.isInteger(value)) {
    return value + "";
  } else {
    return mathjs.format(mathjs.fraction(value));
  }
}

async function timeout(seconds: number) {
  return new Promise<never>(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`));
    }, seconds * 1000);
  });
}

export async function getJSON(url: string) {
  const request = fetch(url);
  const res = await Promise.race([request, timeout(TIMEOUT_SECONDS)]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
}

export async function sendJSON(url: string, uploadData: object) {
  const request = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uploadData),
  });

  const res = await Promise.race([request, timeout(TIMEOUT_SECONDS)]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
}

export async function AJAX(url: string, uploadData: object = undefined) {
  const request = uploadData
    ? fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

  const res = await Promise.race([request, timeout(TIMEOUT_SECONDS)]);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
}
