/**
 * ステータスメッセージ
 */
type TresureResponseStatus = 'OK' | 'NG';

/**
 * レスポンスベース
 */
interface TresureResponseBase {
  /** ステータス */
  status: TresureResponseStatus;
  /** メッセージ */
  error_message: string | null;
}

export type { TresureResponseBase };
