import PredictResultTable from "@/component/search/loto7/PredictResultTable";
import SelectPredict from "@/component/search/loto7/SelectPredict";
import { execPredictPostRequest } from "@/libs/api_client/predict/loto7";
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
import { useState } from "react";

export default function Predict() {
  // リクエスト用のパラメータ
  const [quantity, setQuantity] = useState('1');
  const [necessaryNumbers, setNecessaryNumbers] = useState<PredictNecessaryNumber>([]);
  const [excludeNumbers, setExcludeNumbers] = useState<PredictExcludeNumber>([]);
  const [dispersion, setDispersion] = useState<PredictDispersionParams>(undefined);
  const [terms, setTerms] = useState('');
  const [reverse, setReverse] = useState(false);
  // レスポンス用のパラメータ
  const [predictResult, setPredictResult] = useState<PredictPostResponseParams>([]);

  const handlePredictRequest = async () => {
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
      console.log('response.result: ', response.result);
      setPredictResult(response.result);
      console.log('predictResult', predictResult);
    } catch (e) {
      throw e;
    }
  }
  return (
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
            handlePredictRequest={handlePredictRequest}
          >
          </SelectPredict>
        </Stack>
      </ListItem>
      {predictResult.map((item, index) => (
        <>
          <ListItem>
            <PredictResultTable
              titile={`抽選結果${index + 1}`}
              predict={item}
            />
          </ListItem>
        </>
      ))}
    </List >
  )
}

