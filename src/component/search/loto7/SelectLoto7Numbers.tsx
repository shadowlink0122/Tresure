import {
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText
} from "@mui/material";
import { MAX_LOTO7_NUMBER } from "@/types/loto7";

type SelectLoto7Numbers = {
  numbers: number[],
  setNumbers: (numbers: number[]) => void,
  helperText?: string,
  callBack?: (a: number[]) => void
}

export default function SelectLoto7Numbers(props: SelectLoto7Numbers) {
  const loto7Number: number[] = [...Array(MAX_LOTO7_NUMBER)].map((_, i) => i + 1);
  const handleChangeNumbers = (value: number) => {
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

    if (props.callBack) props.callBack(props.numbers);
  }
  const handleNumbersToString = () => {
    return props.numbers.length < 1 ? '未選択' : props.numbers.join(',');
  }
  return (
    <>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiline
        value={loto7Number}
        renderValue={() => handleNumbersToString()}
        onChange={(e) => {
          handleChangeNumbers(Number(e.target.value as string));
        }}
        onFocus={
          () => { if (props.callBack) props.callBack(props.numbers); }
        }
        input={<OutlinedInput label="Tag" />}
      >
        {
          // 0 ~ 36の配列を作成する
          loto7Number.map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox size="small" checked={props.numbers.indexOf(item) > -1} />
              <ListItemText primary={item}></ListItemText>
            </MenuItem>
          ))
        }
      </Select >
      <FormHelperText sx={{ color: "red" }}>
        {props.helperText!}
      </FormHelperText>
    </>
  )
}