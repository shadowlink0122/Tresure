import { MAX_LOTO7_NUMBER } from "@/types/loto7";
import {
  Box,
  Checkbox,
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tooltip
} from "@mui/material";
import { useState } from "react";

type SelectSearchAppearenceProps = {
  isMainNumber: boolean,
  setIsMainNumber: (isMainNumber: boolean) => void,
  numbers: number[],
  setNumbers: (numbers: number[]) => void
};

export default function SelectSearchAppearence(props: SelectSearchAppearenceProps) {
  const [isClose, setIsClose] = useState(true);
  const loto7Number: number[] = [...Array(1 + MAX_LOTO7_NUMBER)].map((_, i) => i);
  const handleChangeIsMainNumber = (value: boolean) => {
    props.setIsMainNumber(value);
  }
  const handleNumbersToString = () => {
    return props.numbers.length < 1 ? '未選択' : props.numbers.join(',');
  }
  const handleChangeNumbers = (value: number) => {
    if (value === 0) {
      // 閉じる
      setIsClose(true);
      return;
    }
    const indexOf = props.numbers.indexOf(value);
    // すでに含まれる場合、削除
    if (indexOf >= 0) {
      props.setNumbers(
        [...props.numbers].filter(item => item != value)
      );
      return;
    }
    // 含まれていない場合、追加
    props.setNumbers(
      [...props.numbers, value].sort((a, b) => {
        return a > b ? 1 : -1;
      })
    );
  }
  return (
    <List>
      <ListItem>
        <Stack direction='row' spacing={1}>
          <Box sx={{ minWidth: 100 }} >
            {'検索対象'}
          </Box>
          <FormControl>
            <Tooltip title='検索対象' arrow disableFocusListener>
              {/* 本番号を検索するか */}
              <Select
                value={props.isMainNumber}
                onChange={(e) => handleChangeIsMainNumber(e.target.value as boolean)}
              >
                <MenuItem value={true as any}>本番号</MenuItem>
                <MenuItem value={false as any}>ボーナス番号</MenuItem>
              </Select>
            </Tooltip>
          </FormControl>
        </Stack>
      </ListItem>
      <ListItem>
        <Stack direction='row' spacing={1}>
          <Box sx={{ minWidth: 100 }} >
            {'番号を選択'}
          </Box>
          <FormControl sx={{ width: 200 }}>
            <Tooltip title='番号を選択' arrow disableFocusListener>
              {/* 番号を選択 */}
              <Select
                value={[...Array(MAX_LOTO7_NUMBER)]}
                renderValue={() => handleNumbersToString()}
                open={!isClose}
                onClick={() => {
                  if (isClose) {
                    setIsClose(false);
                  }
                }}
                onChange={(e) => {
                  handleChangeNumbers(Number(e.target.value as string));
                }}
              >
                {
                  // 0 ~ 36の配列を作成する
                  loto7Number.map((item) => (
                    <MenuItem key={item} value={item}>
                      {
                        (item > 0) ? <Checkbox size="small" checked={props.numbers.indexOf(item) > -1} /> : <></>
                      }
                      <ListItemText primary={(item > 0 ? item : '閉じる')}></ListItemText>
                    </MenuItem>
                  ))
                }
              </Select >
            </Tooltip>
          </FormControl>
        </Stack>
      </ListItem>
    </List>
  );
}
