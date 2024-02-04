export type NumberDispersion = {
  number: number,
  weight: number
};

function deleteByIndex(array: NumberDispersion[], num: number) {
  return array.filter((_, i) => i != num);
}

export function predict(necessaryNumbers: NumberDispersion[], randomChoosedNumbers: NumberDispersion[], reverse: boolean) {
  let necNumbers = necessaryNumbers.map(item => Object.create(item));
  let randNumbers = [...randomChoosedNumbers];
  let result: NumberDispersion[] = [];
  const MAX_PICK_COUNT = 7;

  // 重みを逆転させる
  if (reverse) {
    // 重みでソートする
    necNumbers.sort((a, b) => a.weight > b.weight ? 1 : -1);
    randNumbers.sort((a, b) => a.weight > b.weight ? 1 : -1);
    // 端っこから入れ替えていく
    for (let i = 0; i < necNumbers.length / 2; i += 1) {
      [necNumbers[i].weight, necNumbers[necNumbers.length - 1 - i].weight] = [necNumbers[necNumbers.length - 1 - i].weight, necNumbers[i].weight];
      // [necNumbers[i].weight, necNumbers[necNumbers.length - 1 - i].weight] = [1000, 1];
    }
    for (let i = 0; i < randNumbers.length / 2; i += 1) {
      [randNumbers[i].weight, randNumbers[randNumbers.length - 1 - i].weight] = [randNumbers[randNumbers.length - 1 - i].weight, randNumbers[i].weight];
    }
  }

  // --- 必要数の抽選 ---
  if (necNumbers.length <= 7) {
    // 必要数が7個以下の場合、すべて入れる
    result = [...necNumbers];
  } else {
    // 必要数だけで抽選を行う
    let totalNecNumbersWeight = necNumbers.reduce((total, item) => total + item.weight, 0);
    // 選ぶ個数
    let pickCount = MAX_PICK_COUNT;
    // 抽選
    while (pickCount-- > 0) {
      // 重みを使って選ぶ
      const weight = Math.random() * totalNecNumbersWeight;
      let incWeight = 0;

      // 選んだ数字にはindexでアクセスする
      let i = 0;
      // 選ぶ処理: 重みを加算して、超えたところが選ばれた数
      while (incWeight < weight) {
        // 重みを加算する
        incWeight += necNumbers[i].weight;
        i += 1;
      }
      i -= 1; // 行きすぎた分を戻す
      result.push(necNumbers[i]); // 選ぶ
      // 選んだ後: 重みの合計から選ばれた分をへらす, 必要数から抽選した数を消す
      totalNecNumbersWeight -= necNumbers[i].weight;
      necNumbers = deleteByIndex(necNumbers, i);
    }
    // 番号順にソートする
    result.sort((a, b) => a.number > b.number ? 1 : -1);
    return result;
  }

  // --- ランダム抽選を入れる ---
  let totalRandomChooseNumbersWeight = randNumbers.reduce((total, item) => total + item.weight, 0);
  let pickCount = MAX_PICK_COUNT - result.length; // 残りの回数
  while (pickCount-- > 0) {
    // 重みを使って選ぶ
    const weight = Math.random() * totalRandomChooseNumbersWeight;
    let incWeight = 0;

    // 選んだ数字にはindexでアクセスする
    let i = 0;
    // 選ぶ処理: 重みを加算して、超えたところが選ばれた数
    while (incWeight < weight) {
      // 重みを加算する
      incWeight += randNumbers[i].weight;
      i += 1;
    }
    i -= 1; // 行きすぎた分を戻す
    result.push(randNumbers[i]); // 選ぶ
    // 選んだ後: 重みの合計から選ばれた分をへらす, 必要数から抽選した数を消す
    totalRandomChooseNumbersWeight -= randNumbers[i].weight;
    randNumbers = deleteByIndex(randNumbers, i);
  }
  // 番号順にソートする
  result.sort((a, b) => a.number > b.number ? 1 : -1);
  return result;
}
