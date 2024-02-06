import { Loto7Crawler } from './loto7';

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

async function main() {
  // クローリング
  await Loto7Crawler();
}

main();
