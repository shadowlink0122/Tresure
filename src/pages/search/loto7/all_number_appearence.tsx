import SimpleButton from "@/component/SimpleButton";
import TresureMenu from "@/component/TresureMenu";
import AllNumberTable from "@/component/search/loto7/AllNumberTable";
import { execSearchAllNumberAppearence } from "@/libs/api_client/search/loto7/all_number_appearence";
import { SearchAllNumberAppearenceRequestParams, SearchAllNumberAppearenceRequestParamsValidator, SearchAllNumberAppearenceResponseParams } from "@/types/api/search/loto7/all_number_appearence";
import { List, ListItem, Stack, TextField } from "@mui/material";
import { useState } from "react";


export default function AllNumberAppearence() {
  const [isMainNumber, setIsMainNumber] = useState<boolean>(true);
  const [terms, setTerms] = useState<string>('5');
  const [numbers, setNumbers] = useState<SearchAllNumberAppearenceResponseParams>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const changeTerms = (terms: string) => {
    const num = Number(terms);
    if (num) {
      return num;
    }
    return 5;
  }
  const handleSearch = async () => {
    try {
      // リクエストパラメータ
      const requestParams: SearchAllNumberAppearenceRequestParams = {
        is_main_number: isMainNumber,
        terms: changeTerms(terms),
      }
      // バリデーションエラー
      const validate = SearchAllNumberAppearenceRequestParamsValidator.safeParse(requestParams);
      if (!validate.success) {
        throw new Error(validate.error.message);
      }
      const response = await execSearchAllNumberAppearence(requestParams);
      if (response.status !== 'OK') {
        throw new Error(response.error_message!);
      }

      // status: 'OK'
      setNumbers(response.result);
      console.log(numbers);
    } catch (e) {
      throw e;
    }
  }

  return (
    <>
      <TresureMenu />
      <List>
        <ListItem>
          <TextField
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <Stack direction='row' spacing={1}>
            <SimpleButton
              title="検索"
              color="info"
              disabled={false}
              onClick={async () => { await handleSearch() }}
            />
          </Stack>
        </ListItem>
        <AllNumberTable
          terms={changeTerms(terms)}
          numbers={numbers}
        />
      </List>
    </>
  )
}

