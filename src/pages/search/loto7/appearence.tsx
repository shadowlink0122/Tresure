import { useState } from "react";
import SelectSearchAppearence from "@/component/search/loto7/SelectSearchAppearence";
import SimpleButton from "@/component/SimpleButton";
import { SearchAppearenceRequestParams, SearchAppearenceResponseParams } from "@/types/api/search/loto7/appearence";
import { execSearchAppearence } from "@/libs/api_client/search/loto7/appearence";
import HistoryTable from "@/component/search/loto7/HistoryTable";
import { List, ListItem, Stack } from "@mui/material";

export default function Appearence() {
  const [isMainNumber, setIsMainNumber] = useState<boolean>(true);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [searchResult, setSearchResult] = useState<SearchAppearenceResponseParams>();
  const canSearch = numbers.length > 0;
  const handleSearchAppearence = async (params: SearchAppearenceRequestParams) => {
    try {
      const response = await execSearchAppearence(params);
      setSearchResult(response.result);
    } catch (e) {
      throw e;
    }
  };
  return (
    <List>
      <ListItem>
        <Stack direction='row' spacing={1}>
          <SelectSearchAppearence
            isMainNumber={isMainNumber}
            setIsMainNumber={setIsMainNumber}
            numbers={numbers}
            setNumbers={setNumbers}
          >
          </SelectSearchAppearence>
        </Stack>
      </ListItem>
      <ListItem>
        <Stack direction='row' spacing={1}>
          <SimpleButton
            title="検索"
            color="info"
            disabled={!canSearch}
            onClick={async () => {
              const params: SearchAppearenceRequestParams = {
                is_main_number: isMainNumber,
                numbers: numbers
              };
              await handleSearchAppearence(params);
            }}
          />
        </Stack>
      </ListItem>
      {searchResult?.map(item => (
        <>
          <ListItem>
            <Stack direction='row' spacing={1}>
              {`結果[${item.number}]: 合計${item.appearences.length}`}
            </Stack>
          </ListItem>
          <ListItem>
            <Stack direction='row' spacing={1}>
              <HistoryTable
                loto7={item.appearences}
              />
            </Stack >
          </ListItem>
        </>
      ))}
    </List >
  );
}
