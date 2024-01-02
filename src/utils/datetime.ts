
/**
 * 和暦を西暦に変換する関数
 * @param jpYear - 和暦 平成25年4月5日
 * @return       - 西暦 2013-04-05
 */
export function toGregorianYear(jpYear: string): Date {
    const [eraAndYear, date]: string[] = jpYear.split('年') // 平成25, 4月5日
    const era: string = eraAndYear.slice(0, 2)       // 元号 ex) 平成
    const year: number = Number(eraAndYear.slice(2))
    const [month, day]: string[] = date.split('月').map(v => {
        if (v.includes('日')) v = v.slice(0, -1) // 日を除去
        return v.padStart(2, '0');
    })

    let offset: number = 0
    switch (era) {
        case '令和':
            offset = 2018; break;
        case '平成':
            offset = 1988; break;
        case '昭和':
            offset = 1925; break;
        default:
            throw new Error("未対応");
    }
    const dateString = [(year + offset).toString(), month, day].join('-')

    return new Date(dateString)
}
