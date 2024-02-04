import { getHtmlFromURL, writeToLocalFileSync } from './constants';
import { LOTO7 } from '../src/types/loto7';
import { LOTO7_FILENAME } from './constants';
import iconv from 'iconv-lite';
import { getSavedLoto7DataSync } from '../src/db/file';

async function crawl(start: number) {
  // スタート位置
  let START_IMPLEMENT = start;
  const result: LOTO7[] = [];

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
    result.push(loto7);
    START_IMPLEMENT += 1;
  }
  return result;
}

export async function Loto7Crawler() {
  const fileContent = getSavedLoto7DataSync();
  const startNum = (fileContent !== null && fileContent.length !== 0) ? fileContent!.length + 1 : 1;
  // クローリング
  const result = await crawl(startNum);

  // データを保存
  if (startNum !== 1) {
    // 最後にデータを追加
    const res = [...fileContent!, ...result];
    writeToLocalFileSync(LOTO7_FILENAME, res);
  } else {
    // すべてのデータを追加
    writeToLocalFileSync(LOTO7_FILENAME, result);
  }
}
