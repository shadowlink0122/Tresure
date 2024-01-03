// TODO: utilityとか入ったら移動する
import { LOTO7, LOTO7_HISTORY_FROM_DEFAULT, LOTO7_HISTORY_TIMES_DEFAULT } from "@/types/loto7";
import { NumberParams, TermParams } from "@/types/api/loto7/history";

export function findByNumber(data: LOTO7[], params: NumberParams) {
    // 降順に並び替える(最新が[0])
    data.sort((a, b) => Number(a.id) > Number(b.id) ? -1 : 1)

    if (params) {
        let { from, times } = params;
        // undefinedだったらdefault値を入れる
        from = from ? from - 1 : LOTO7_HISTORY_FROM_DEFAULT;
        times = times ? times : LOTO7_HISTORY_TIMES_DEFAULT;
        // 検索
        return data.slice(from, Math.min(from + times, data.length));
    }
    return data.slice(LOTO7_HISTORY_FROM_DEFAULT, LOTO7_HISTORY_TIMES_DEFAULT);
}

export function findByTerm(data: LOTO7[], params: TermParams) {
    // 降順に並び替える
    data.sort((a, b) => Number(a.id) > Number(b.id) ? -1 : 1)

    if (params !== undefined) {
        const { since, until } = params;
        const dateSince: Date | undefined = since ? new Date(since) : undefined;
        const dateUntil: Date | undefined = until ? new Date(until) : undefined;
        if (dateSince && dateUntil) {
            // 区間内を検索
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

