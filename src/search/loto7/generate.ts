function random() {
  const LOTO = [...Array(37)].map((_, i: number) => Number(i + 1));
  const pick = 7;
  const tmp: number[] = [];
  const result: number[] = [];
  let lotoSize = LOTO.length;
  let pickCount = pick < lotoSize ? pick : lotoSize;
  while (pickCount-- > 0) {
    let i = (Math.random() * lotoSize) | 0;
    result[pickCount] = tmp[i] || LOTO[i];
    --lotoSize;
    tmp[i] = tmp[lotoSize] || LOTO[lotoSize];
  }
  return result.sort((a, b) => (a > b ? 1 : -1));
}

function main() {
  for (let i = 0; i < 10; i += 1) {
    const result = random();
    console.log(`[ ${result.join(', ')} ]`);
  }
}
main();
