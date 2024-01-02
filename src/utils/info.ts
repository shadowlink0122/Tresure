// TODO: utilityとか入ったら移動する
import { LOTO7 } from "@/types/loto7";
import { ParamTypeNumber } from "@/types/api/loto7/info";

export function findByNumber(data: LOTO7[], params: ParamTypeNumber): LOTO7[] {
    // 降順に並び替える
    data.sort((a, b) => Number(a.id) > Number(b.id) ? -1 : 1)

    // default値を入れる
    let { from, times } = params ?? { from: Number(data[0].id), times: 20 }
    if (!from) from = Number(data[0].id)
    if (!times) times = 20

    const targetIndex = data.findIndex(v => Number(v.id) === from!)
    // 要素数超えるときは丸める
    if (targetIndex + times > data.length) {
        times = data.length - targetIndex
    }

    return data.slice(targetIndex, targetIndex + times)
}