import { getHtmlFromURL, writeToLocalFileSync } from './constants';
import { LOTO7 } from '@/types/loto';
import { LOTO7_FILENAME } from './constants';
import iconv from 'iconv-lite';

// URL
/**
 * ミニロトのURLの境目
 * https://www.mizuhobank.co.jp/retail/takarakuji/check/loto/backnumber/loto0501.html
 * https://www.mizuhobank.co.jp/retail/takarakuji/check/loto/backnumber/detail.html?fromto=521_540&type=miniloto
 * 
 * 
 * ロト6のURLの境目
 * https://www.mizuhobank.co.jp/retail/takarakuji/check/loto/backnumber/loto60441.html
 * https://www.mizuhobank.co.jp/retail/takarakuji/check/loto/backnumber/detail.html?fromto=461_480&type=loto6
 * 
 * ロト7
 * https://www.mizuhobank.co.jp/retail/takarakuji/check/loto/backnumber/detail.html?fromto=1_20&type=loto7
 */
let START_IMPLEMENT = 1;
const impNumber = String(START_IMPLEMENT.toString()).padStart(4, '0');
const DATA_SOURCE_BASE_URL = `https://www.mizuhobank.co.jp/retail/takarakuji/loto/loto7/csv/A103${impNumber}.CSV`;

// loto variables
const loto7Data: LOTO7[] = [];

async function crawl() {
  // データソースのHTMLを取得
  while (true) {
    // 実施回数は4桁にする
    const html = await getHtmlFromURL(DATA_SOURCE_BASE_URL);
    if (html === null) {
      break;
    }

    // console.log(iconv.decode(Buffer.from(html), 'eucjp'));
    console.log(html);

    START_IMPLEMENT += 1;
    break;
  }
}

export async function Loto7Crawler() {
  // クローリング
  await crawl();

  // データを保存
  writeToLocalFileSync(LOTO7_FILENAME, loto7Data);
}
