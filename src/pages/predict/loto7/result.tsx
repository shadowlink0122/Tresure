import TresureMenu from "@/component/TresureMenu";
import PredictResultTable from "@/component/predirct/loto7/result/PredictResultTable";
import { execPredictResultGetRequest } from "@/libs/api_client/predict/loto7/result";
import { PredictResultGetResponseParams } from "@/types/api/predict/loto7/result";
import { List, ListItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PredictResult() {
  const [predictResult, setPredictResult] = useState<PredictResultGetResponseParams>(
    // 初期値を入れておく
    {
      implement: '0',
      result: []
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGetRequest = async () => {
    let idParam = router.query.id;
    console.log(`idParam: ${idParam}`);
    if (!(typeof idParam === 'string')) {
      // エラーの場合は undefined を入れる
      idParam = undefined;
    }

    const response = await execPredictResultGetRequest(idParam);
    if (response.result !== undefined) {
      console.log(response.result);
      setPredictResult(response.result);
    } else {
      setPredictResult(Object({}));
    }
    setIsLoading(false);
  }
  useEffect(() => {
    if (!router.isReady) return;
    if (isLoading) return;
    (async () => {
      await handleGetRequest();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router]);
  return (
    <>
      <TresureMenu />
      <List>
        <ListItem>
          <Typography>
            {`第${predictResult.implement}回の予想結果`}
          </Typography>
        </ListItem>
        {(predictResult.result.length === 0) ?
          <Typography>当選した番号がありません</Typography> :
          [...Array(6)].map((_, i) => {
            const rank = i + 1;
            // 1~6等をそれぞれ集める
            const sameRankResult = predictResult.result.filter(item => item.rank === rank);
            if (sameRankResult.length === 0) return (
              <></>
            );
            return (<>
              <ListItem>
                <PredictResultTable
                  title={`${rank}等 ${sameRankResult.length}個`}
                  result={sameRankResult}
                />
              </ListItem>
            </>);
          })}
      </List>
    </>
  )
}