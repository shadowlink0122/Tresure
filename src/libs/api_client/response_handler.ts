import { TresureResponseBase } from '@/types/api/tresure_response_base';
import { error } from 'console';

export async function responseHandler<T extends TresureResponseBase>(
  response: Response,
  userAction: string,
) {
  let result = null;
  try {
    result = (await response.json()) as T;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`Internal server Error: ${userAction}`);
  }

  // レスポンスが取得できなかった場合
  if (result === null || result === undefined) {
    throw new Error(
      `Request: ${userAction} | Http response is ${response.statusText}.`,
    );
  }

  // エラーの場合
  if (result?.status !== 'OK') {
    // エラーメッセージがある場合
    if (result?.error_message !== null) {
      throw new Error(`Request: ${userAction} | ${result?.error_message}`);
    }
    // 無ければステータスコードを返す
    throw new Error(`Request: ${userAction} | status: ${response.statusText}`);
  }

  return result;
}
