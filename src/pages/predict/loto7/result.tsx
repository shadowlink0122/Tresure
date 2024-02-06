import TresureHeader from '@/component/TresureHeader';
import TresureMenu from '@/component/TresureMenu';
import PredictResultTable from '@/component/predirct/loto7/result/PredictResultTable';
import { execPredictResultGetRequest } from '@/libs/api_client/predict/loto7/result';
import { PredictResultGetResponseParams } from '@/types/api/predict/loto7/result';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PredictResult() {
  const [predictResult, setPredictResult] =
    useState<PredictResultGetResponseParams>(
      // 初期値を入れておく
      {
        implement: '0',
        result: [],
      },
    );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
  };
  useEffect(() => {
    if (!router.isReady) return;
    setIsLoading(true);
    (async () => {
      await handleGetRequest();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  console.log(router.asPath);
  return (
    <>
      <TresureMenu path={router.asPath} />
      {isLoading ? (
        <TresureHeader message="結果を読み込み中" />
      ) : (
        <TresureHeader path={router.asPath} />
      )}

      {isLoading ? (
        // 読み込み画面
        <>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        // 読み込み終了
        <List>
          <ListItem>
            <Typography>{`第${predictResult.implement}回の予想結果`}</Typography>
          </ListItem>
          {predictResult.result.length === 0 ? (
            <Typography>当選した番号がありません</Typography>
          ) : (
            [...Array(6)].map((_, i) => {
              const rank = i + 1;
              // 1~6等をそれぞれ集める
              const sameRankResult = predictResult.result.filter(
                (item) => item.rank === rank,
              );
              if (sameRankResult.length === 0) return <></>;
              return (
                <>
                  <ListItem>
                    <PredictResultTable
                      title={`${rank}等 ${sameRankResult.length}個`}
                      result={sameRankResult}
                    />
                  </ListItem>
                </>
              );
            })
          )}
        </List>
      )}
    </>
  );
}
