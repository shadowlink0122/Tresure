// TODO: utilityとか入ったら移動する
import { LOTO7 } from "@/types/loto7";
import { NumberParams, TermParams } from "@/types/api/loto7/info";

export function findByNumber(data: LOTO7[], params: NumberParams) {
    // 降順に並び替える(最新が[0])
    data.sort((a, b) => Number(a.id) > Number(b.id) ? -1 : 1)

    // default値を入れる
    if (params) {
        let { from, times } = params;
        from = from ? from - 1 : 0; // 0,20を定数にしてください
        times = times ? times : 20;
        // 検索
        return data.slice(from, Math.min(from + times, data.length));
    }
    return data.slice(0, 20);
}

export function findByTerm(data: LOTO7[], params: TermParams) {
    // 降順に並び替える
    data.sort((a, b) => Number(a.id) > Number(b.id) ? -1 : 1)

    // default値を入れる
    if (params !== undefined) {
        const { since, until } = params;
        const dateSince: Date | undefined = since ? new Date(since) : undefined;
        const dateUntil: Date | undefined = until ? new Date(until) : undefined;
        if (dateSince && dateUntil) {
            // 区間内を検索
            console.log(dateSince, data[0].date, dateUntil)
            return data.filter(v => dateSince <= v.date && v.date <= dateUntil);
        } else if (dateSince) {
            // ここから最新まで検索
            return data.filter(v => dateSince <= v.date);
        } else if (dateUntil) {
            // 過去からuntilまで検索
            return data.filter(v => v.date <= dateUntil);
        }
    }
    return null
}

