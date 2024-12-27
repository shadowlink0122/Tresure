import TresureHeader from '@/component/TresureHeader';
import TresureMenu from '@/component/TresureMenu';
import PredictTable from '@/component/predirct/loto7/index/PredictTable';
import SelectPredict from '@/component/predirct/loto7/index/SelectPredict';
import AllNumberTable from '@/component/search/loto7/AllNumberTable';
import { GetDescription } from '@/libs/CategoryInfomation';
import {
  execPredictGetRequest,
  execPredictPostRequest,
} from '@/libs/api_client/predict/loto7';
import { execSearchAllNumberAppearence } from '@/libs/api_client/search/loto7/all_number_appearence';
import {
  PredictDispersionParams,
  PredictExcludeNumber,
  PredictNecessaryNumber,
  PredictPostRequestParams,
  PredictPostRequestParamsValidator,
  PredictPostResponseParams,
} from '@/types/api/predict/loto7';
import { SearchAllNumberAppearenceRequestParams, SearchAllNumberAppearenceRequestParamsValidator, SearchAllNumberAppearenceResponseParams } from '@/types/api/search/loto7/all_number_appearence';
import { Box, CircularProgress, List, ListItem, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Predict() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 抽選用のパラメータ
  const [quantity, setQuantity] = useState('1');
  const [necessaryNumbers, setNecessaryNumbers] =
    useState<PredictNecessaryNumber>([]);
  const [excludeNumbers, setExcludeNumbers] = useState<PredictExcludeNumber>(
    [],
  );
  const [dispersion, setDispersion] =
    useState<PredictDispersionParams>(undefined);
  const [terms, setTerms] = useState('0');
  const [reverse, setReverse] = useState(false);
  // レスポンス用のパラメータ
  const [nextImplementNumber, setNextImplementNumber] = useState<number>(0);
  const [predictResult, setPredictResult] = useState<PredictPostResponseParams>(
    [],
  );

  // 出現数検索用パラメータ
  const [isMainNumber, setIsMainNumber] = useState<boolean>(true);
  const [numbers, setNumbers] =
    useState<SearchAllNumberAppearenceResponseParams>([]);
  const changeTerms = (terms: string) => {
    const num = Number(terms);
    if (num < 1 || nextImplementNumber <= num) {
      return nextImplementNumber - 1;
    }
    return num;
  };

  // 抽選用のリクエスト
  const handlePredictGetRequest = async () => {
    try {
      const response = await execPredictGetRequest();
      if (response.status !== 'OK') {
        console.log('error: ', response.error_message);
        throw new Error(response.error_message!);
      }
      if (response.result !== undefined) {
        setNextImplementNumber(response.result?.next);
      } else {
        throw new Error('パラメータが不正です');
      }
    } catch (e) {
      throw e;
    }
  };

  const handlePredictPostRequest = async () => {
    setIsLoading(true);
    // リクエストの準備
    const termsNumber = changeTerms(terms);
    setTerms(termsNumber.toString());
    const disp: PredictDispersionParams =
      dispersion === undefined
        ? undefined
        : {
          terms: termsNumber,
          reverse: reverse,
        };
    const requestParams: PredictPostRequestParams = {
      quantity: Number(quantity),
      necessary: necessaryNumbers,
      exclude: excludeNumbers,
      dispersion: disp,
    };
    const validate = PredictPostRequestParamsValidator.safeParse(requestParams);
    if (!validate.success) {
      setIsLoading(false);
      return;
    }
    // 結果を取得する
    try {
      const response = await execPredictPostRequest(requestParams);
      if (response.status !== 'OK') {
        console.log('error: ', response.error_message);
        return;
      }
      setPredictResult(response.result);
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
    setIsLoading(false);
  };

  // 出現数検索用のリクエスト
  const handleSearch = async (termsNumber: string) => {
    try {
      let terms = Number(termsNumber);
      // 検索しない
      if (termsNumber === undefined || termsNumber === '' || Number.isNaN(terms)) return;
      // 検索する
      if (terms < 1) terms = 1;
      else if (nextImplementNumber <= terms) terms = nextImplementNumber;
      // リクエストパラメータ
      const requestParams: SearchAllNumberAppearenceRequestParams = {
        is_main_number: isMainNumber,
        terms: terms,
      };
      // バリデーションエラー
      const validate =
        SearchAllNumberAppearenceRequestParamsValidator.safeParse(
          requestParams,
        );
      if (!validate.success) {
        throw new Error(validate.error.message);
      }
      const response = await execSearchAllNumberAppearence(requestParams);
      if (response.status !== 'OK') {
        throw new Error(response.error_message!);
      }

      // status: 'OK'
      setNumbers(response.result);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    const getNextImplementNumber = async () => {
      await handlePredictGetRequest();
    };
    getNextImplementNumber();
  });
  return (
    <>
      <TresureMenu path={router.asPath} />
      <TresureHeader
        message={GetDescription(router.asPath).replace(
          '${nextImplementNumber}',
          `${nextImplementNumber}`,
        )}
      />
      <List>
        <ListItem>
          <Stack direction="row" spacing={1}>
            <SelectPredict
              quantity={quantity}
              setQuantity={setQuantity}
              necessary={necessaryNumbers}
              setNecessary={setNecessaryNumbers}
              exclude={excludeNumbers}
              setExclude={setExcludeNumbers}
              dispersion={dispersion}
              setDispersion={setDispersion}
              terms={terms}
              setTerms={(terms: string) => {
                setTerms(terms);
                handleSearch(terms);
              }}
              reverse={reverse}
              setReverse={setReverse}
              handlePredictRequest={handlePredictPostRequest}
            ></SelectPredict>
          </Stack>
          <AllNumberTable terms={changeTerms(terms)} numbers={numbers} />
        </ListItem>
        {isLoading ?
          // 読み込み画面
          <>
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          </>
          :
          <>
            {predictResult.map((item, index) => (
              <>
                <ListItem>
                  <PredictTable titile={`抽選結果${index + 1}`} predict={item} />
                </ListItem>
              </>
            ))}
          </>
        }
      </List>
    </>
  );
}
