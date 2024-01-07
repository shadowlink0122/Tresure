import { AllNumberAppearenceStatus, NumberCountParams } from "@/types/api/search/loto7/all_number_appearence";

export function getColorByFrequence(volume: AllNumberAppearenceStatus | undefined) {
  switch (volume) {
    case 'most':
      return "hotpink";
    case 'many':
      return "lightpink";
    case 'few':
      return 'lightskyblue';
    case 'less':
      return 'deepskyblue';
    default:
      break;
  }
  return '';
}

type AllNumberTableProps = {
  terms: number,
  numbers: NumberCountParams[]
};

export default function AllNumberTable(props: AllNumberTableProps) {
  // 一定の個数で分ける
  const chunk = <T extends any[]>(arr: T, size: number): T[] => {
    return arr.reduce(
      (newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]),
      [] as T[][]
    )
  }
  const chunkNum = 10;
  return (
    <table className="numbers" cellSpacing="1" style={{
      border: "solid 1px #222",
      borderCollapse: "collapse",
      padding: "4px"
    }}>
      <tbody>
        {/* 番号 */}
        {chunk<NumberCountParams[]>(props.numbers, chunkNum).map((chunkedNumberArray, index) => {
          // 足りない分を補充
          // 足りない分を補充
          while (chunkNum > chunkedNumberArray.length) chunkedNumberArray.push({
            number: -1,
            count: 0
          });
          return (
            <>
              <tr>
                {chunkedNumberArray.map((item, i) => (
                  <>
                    {(index === 0 && i === 0) ? <th rowSpan={4}>番号</th> : <></>}
                    {(item.number !== -1) ? <th style={{ backgroundColor: getColorByFrequence(item.volume) }}><b>{item.number}</b></th> : <td style={{ backgroundColor: 'gray' }}></td>}
                  </>
                ))
                }
              </tr>
            </>
          )
        })}
      </tbody>
      <tbody>
        {/* 出現回数 */}
        {chunk<NumberCountParams[]>(props.numbers, chunkNum).map((chunkedNumberArray, index) => {
          // 足りない分を補充
          while (chunkNum > chunkedNumberArray.length) chunkedNumberArray.push({
            number: -1,
            count: 0
          });
          return (
            <>
              <tr>
                {chunkedNumberArray.map((item, i) => (
                  <>
                    {(index === 0 && i === 0) ? <th rowSpan={4}>{`直近${props.terms}回の`} <br /> {'出現数'}</th> : <></>}
                    {(item.number !== -1) ?
                      <td align="right" style={{ backgroundColor: getColorByFrequence(item.volume) }}>{item.count}回</td> :
                      <td style={{ backgroundColor: 'gray' }}></td>}
                  </>
                ))
                }
              </tr>
            </>
          )
        })}
      </tbody >
    </table >

  )
}
