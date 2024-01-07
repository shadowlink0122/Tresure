import { MAX_LOTO7_NUMBER } from "@/types/loto7";
import {
  Accordion,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SimpleButton from "@/component/SimpleButton";
import { SearchAppearenceRequestParams } from "@/types/api/search/loto7/appearence";

type SelectSearchAppearenceProps = {
  isMainNumber: boolean,
  setIsMainNumber: (isMainNumber: boolean) => void,
  numbers: number[],
  setNumbers: (numbers: number[]) => void,
  canSearch: boolean,
  handleSearchAppearence: (params: SearchAppearenceRequestParams) => Promise<void>
};

export default function SelectSearchAppearence(props: SelectSearchAppearenceProps) {
  const loto7Number: number[] = [...Array(MAX_LOTO7_NUMBER)].map((_, i) => i + 1);
  const handleChangeIsMainNumber = (value: boolean) => {
    props.setIsMainNumber(value);
  }
  const handleNumbersToString = () => {
    return props.numbers.length < 1 ? '未選択' : props.numbers.join(',');
  }
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
  }
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>検索</Typography>
      </AccordionSummary>
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
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Tooltip title='番号を選択' arrow disableFocusListener>
                {/* 番号を選択 */}
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiline
                  value={[...Array(MAX_LOTO7_NUMBER)]}
                  renderValue={() => handleNumbersToString()}
                  onChange={(e) => {
                    handleChangeNumbers(Number(e.target.value as string));
                  }}
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
              </Tooltip>
            </FormControl>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction='row' spacing={1}>
            <SimpleButton
              title="検索"
              color="info"
              disabled={!props.canSearch}
              onClick={async () => {
                const params: SearchAppearenceRequestParams = {
                  is_main_number: props.isMainNumber,
                  numbers: props.numbers
                };
                await props.handleSearchAppearence(params);
              }}
            />
          </Stack>
        </ListItem>
      </List>
    </Accordion>
  );
}
