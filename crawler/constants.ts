import got from "got";
import { MiniLOTO, LOTO6, LOTO7 } from "@/types/loto";
import fs from 'fs';
import { join } from "path";

// type
type crawlResult = MiniLOTO[] | LOTO6[] | LOTO7[];

// FUNCTIONS
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
export async function getHtmlFromURL(url: string) {
  try {
    // httpリクエスト
    console.log(`GET: ${url}`);
    const response = await got.get(url);
    await sleep(500);

    if (response.statusCode !== 200) {
      throw new Error(`StatusCode: ${response.statusCode}`);
    }

    // 結果を取得
    return response.body;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      throw e;
    }
    return null;
  }
}

export function writeToLocalFileSync(filename: string, result: crawlResult) {
  try {
    fs.mkdirSync(BASE_DIR, { recursive: true });
    fs.writeFileSync(filename, JSON.stringify(result));
  } catch (e) {
    throw e;
  }
}

// filename
const BASE_DIR = 'result';
const LOTO7_FILENAME = join(BASE_DIR, 'loto7.json');

export {
  BASE_DIR,
  LOTO7_FILENAME
}