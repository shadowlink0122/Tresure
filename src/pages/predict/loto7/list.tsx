import TresureHeader from '@/component/TresureHeader';
import TresureMenu from '@/component/TresureMenu';
import PredictTable from '@/component/predirct/loto7/index/PredictTable';
import { GetDescription } from '@/libs/CategoryInfomation';
import { execPredictListGetRequest } from '@/libs/api_client/predict/loto7/list';
import { SavedPredictList } from '@/types/api/predict/loto7';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PredictList() {
  const router = useRouter();
  // レスポンス用のパラメータ
  const [implementNumber, setImplementNumber] = useState<string | null>(null);
  const [predictList, setPredictList] = useState<SavedPredictList>([]);
  // 検索用パラメータ
  const [searchedPredictList, setSearchedPredictList] =
    useState<SavedPredictList>([]);
  const [searchResultLength, setSearchResultLength] = useState(0);
  const [similarCount, setSimilarCount] = useState<string>('0');
  let count = 1;
  // 読み込み
  const [isLoading, setIsLoading] = useState(false);

  const handleSetSearchResultLength = () => {
    let i = 0;
    searchedPredictList.map((element) => (i += element.predict.length));
    setSearchResultLength(i);
  };

  const handleSearchBySimilarCount = () => {
    let number: number | null;
    try {
      number = Number(similarCount);
    } catch {
      number = null;
    }
    if (similarCount === '' || number === 0) number = null;
    if (number === null) {
      setSearchedPredictList(predictList);
      return;
    }
    const result: SavedPredictList = [];
    predictList.map((element) => {
      element.predict.map((item) => {
        if (item.similar_pick.count_same_number === number) {
          result.push({
            dispersion: element.dispersion,
            predict: [item],
          });
        }
      });
    });
    setSearchedPredictList(result);
  };

  const handleGetPredictList = async () => {
    let idParam = router.query.id;
    console.log(`idParam: ${idParam}`);
    if (!(typeof idParam === 'string')) {
      // エラーの場合は undefined を入れる
      idParam = undefined;
    }

    const response = await execPredictListGetRequest(idParam);
    if (response.result !== undefined) {
      console.log(response.result);
      setImplementNumber(response.result.implement);
      setPredictList(response.result.result);
      setSearchedPredictList(response.result.result);
    } else {
      setImplementNumber(null);
      setPredictList([]);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    setIsLoading(true);
    const getPredictList = async () => {
      await handleGetPredictList();
      console.log(predictList);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      count = 1;
      setIsLoading(false);
    };
    getPredictList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  useEffect(() => {
    handleSearchBySimilarCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [similarCount]);
  useEffect(() => {
    handleSetSearchResultLength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedPredictList]);
  return (
    <>
      <TresureMenu path={router.asPath} />
      <TresureHeader
        message={
          isLoading
            ? '予想一覧を読み込み中'
            : implementNumber !== null
              ? GetDescription(router.asPath).replace(
                  '${implementNumber}',
                  `${implementNumber}`,
                )
              : '抽選一覧が存在しません'
        }
      />
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
            <TextField
              label="過去の抽選と類似する桁数"
              value={similarCount}
              onChange={(e) => {
                setSimilarCount(e.target.value);
              }}
            />
          </ListItem>
          <ListItem>
            <Typography>検索結果: {searchResultLength}</Typography>
          </ListItem>
          {searchedPredictList.map((element) => {
            return (
              <>
                {element.predict.map((item) => {
                  return (
                    <>
                      <ListItem>
                        <PredictTable
                          titile={`抽選結果${count++}`}
                          dispersoin={element.dispersion}
                          predict={item}
                        />
                      </ListItem>
                    </>
                  );
                })}
              </>
            );
          })}
        </List>
      )}
    </>
  );
}
