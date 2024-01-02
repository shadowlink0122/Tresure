import { getHtmlFromURL, writeToLocalFileSync } from './constants';
import { LOTO7 } from '../src/types/loto7';
import { LOTO7_FILENAME } from './constants';
import iconv from 'iconv-lite';

// loto variables
const loto7Data: LOTO7[] = [];

async function crawl() {
  let START_IMPLEMENT = 1;
  // データソースのHTMLを取得
  while (true) {
    // 実施回数は4桁に合わせる
    const impNumber = String(START_IMPLEMENT.toString()).padStart(4, '0');
    // URL
    const DATA_SOURCE_BASE_URL = `https://www.mizuhobank.co.jp/retail/takarakuji/loto/loto7/csv/A103${impNumber}.CSV`;
    // htmlを取得する
    const htmlBuffer = await getHtmlFromURL(DATA_SOURCE_BASE_URL);
    if (htmlBuffer === null) {
      break;
    }
    const html = iconv.decode(<Buffer><unknown>htmlBuffer, 'SHIFT_JIS');
    // 余計な改行をコンマに置き換えて、コンマで分ける
    const splitedHtml = html.replace(/\r?\n/g, ',').split(',');
    const loto7: LOTO7 = {
      implemention: splitedHtml[1],
      date: splitedHtml[3],
      mainNumber: splitedHtml.slice(8, 15).map(Number),
      bonusNumber: splitedHtml.slice(16, 18).map(Number),
    }
    loto7Data.push(loto7);
    START_IMPLEMENT += 1;
  }
}

export async function Loto7Crawler() {
  // クローリング
  await crawl();

  // データを保存
  writeToLocalFileSync(LOTO7_FILENAME, loto7Data);
}
