import TresureHeader from "@/component/TresureHeader";
import TresureMenu from "@/component/TresureMenu";
import PredictTable from "@/component/predirct/loto7/index/PredictTable";
import SelectPredict from "@/component/predirct/loto7/index/SelectPredict";
import { GetDescription } from "@/libs/CategoryInfomation";
import { execPredictGetRequest, execPredictPostRequest } from "@/libs/api_client/predict/loto7";
import {
  PredictDispersionParams,
  PredictExcludeNumber,
  PredictNecessaryNumber,
  PredictPostRequestParams,
  PredictPostRequestParamsValidator,
  PredictPostResponseParams,
} from "@/types/api/predict/loto7";
import {
  List,
  ListItem,
  Stack
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Predict() {
  const router = useRouter();
  // リクエスト用のパラメータ
  const [quantity, setQuantity] = useState('1');
  const [necessaryNumbers, setNecessaryNumbers] = useState<PredictNecessaryNumber>([]);
  const [excludeNumbers, setExcludeNumbers] = useState<PredictExcludeNumber>([]);
  const [dispersion, setDispersion] = useState<PredictDispersionParams>(undefined);
  const [terms, setTerms] = useState('');
  const [reverse, setReverse] = useState(false);
  // レスポンス用のパラメータ
  const [nextImplementNumber, setNextImplementNumber] = useState<number>(0);
  const [predictResult, setPredictResult] = useState<PredictPostResponseParams>([]);

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
        throw new Error('パラメータが不正です')
      }
    } catch (e) {
      throw e;
    }
  };

  const handlePredictPostRequest = async () => {
    // リクエストの準備
    const disp: PredictDispersionParams = (dispersion === undefined) ? undefined :
      {
        terms: (terms === '') ? undefined : Number(terms),
        reverse: reverse
      };
    const requestParams: PredictPostRequestParams = {
      quantity: Number(quantity),
      necessary: necessaryNumbers,
      exclude: excludeNumbers,
      dispersion: disp
    }
    const validate = PredictPostRequestParamsValidator.safeParse(requestParams);
    if (!validate.success) {
      console.log('error');
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
      throw e;
    }
  }

  useEffect(() => {
    const getNextImplementNumber = async () => {
      await handlePredictGetRequest();
    }
    getNextImplementNumber();
  });
  return (
    <>
      <TresureMenu
        path={router.asPath}
      />
      <TresureHeader
        message={GetDescription(router.asPath).replace('${nextImplementNumber}', `${nextImplementNumber}`)}
      />
      <List>
        <ListItem>
          <Stack direction='row' spacing={1}>
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
              setTerms={setTerms}
              reverse={reverse}
              setReverse={setReverse}
              handlePredictRequest={handlePredictPostRequest}
            >
            </SelectPredict>
          </Stack>
        </ListItem>
        {predictResult.map((item, index) => (
          <>
            <ListItem>
              <PredictTable
                titile={`抽選結果${index + 1}`}
                predict={item}
              />
            </ListItem>
          </>
        ))}
      </List >
    </>
  )
}

