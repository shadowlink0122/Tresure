import {
  Accordion,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  MaxExcludeNumberLength,
  PredictDispersionParams,
  PredictExcludeNumber,
  PredictNecessaryNumber,
  PredictPostResponseParams,
  PredictQuantityValidator,
} from '@/types/api/predict/loto7';
import { useState } from 'react';
import SimpleButton from '@/component/SimpleButton';
import SelectLoto7Numbers from '../../../search/loto7/SelectLoto7Numbers';

type PredictProps = {
  quantity: string;
  setQuantity: (quantity: string) => void;
  necessary: PredictNecessaryNumber;
  setNecessary: (necessary: PredictNecessaryNumber) => void;
  exclude: PredictExcludeNumber;
  setExclude: (exclude: PredictExcludeNumber) => void;
  dispersion: PredictDispersionParams;
  setDispersion: (dispersion: PredictDispersionParams) => void;
  terms: string;
  setTerms: (terms: string) => void;
  reverse: boolean;
  setReverse: (reverse: boolean) => void;
  handlePredictRequest: () => Promise<void>;
};

export default function SelectPredict(props: PredictProps) {
  const [expand, setExpand] = useState(true);
  const [quantityError, setQuantityError] = useState('');
  const [necessaryNumbersError, setNecessaryNumbersError] = useState('');
  const [excludeNumbersError, setExcludeNumbersError] = useState('');
  const [termsError, setTermsError] = useState('');
  const MIN_DIWTH = 200;
  const includeSameValue = () => {
    for (const item of props.necessary) {
      for (const i of props.exclude) {
        if (item === i) {
          setNecessaryNumbersError('同じ数が含まれています');
          return;
        }
      }
    }
    setNecessaryNumbersError('');
  };
  const checkExcludeLength = () => {
    setExcludeNumbersError(
      props.exclude.length > MaxExcludeNumberLength
        ? '除外する数は20個までです'
        : '',
    );
  };

  return (
    <Accordion
      expanded={expand}
      onChange={() => {
        setExpand(!expand);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{'抽選条件の設定'}</Typography>
      </AccordionSummary>
      <List>
        <ListItem>
          {/* 抽選回数 */}
          <Typography sx={{ minWidth: MIN_DIWTH }}>抽選回数</Typography>
          <TextField
            helperText={quantityError}
            value={props.quantity}
            onChange={(e) => {
              const validate = PredictQuantityValidator.safeParse(
                Number(e.target.value),
              );
              if (!validate.success) {
                setQuantityError('1以上の整数で入力してください');
              } else {
                setQuantityError('');
              }
              props.setQuantity(e.target.value);
            }}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ minWidth: MIN_DIWTH }}>
            抽選に必ず入れる数
          </Typography>
          <SelectLoto7Numbers
            numbers={props.necessary}
            setNumbers={props.setNecessary}
            helperText={necessaryNumbersError}
            callBack={includeSameValue}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ minWidth: MIN_DIWTH }}>
            抽選から除外する数
          </Typography>
          <SelectLoto7Numbers
            numbers={props.exclude}
            setNumbers={props.setExclude}
            helperText={excludeNumbersError}
            callBack={() => {
              includeSameValue();
              checkExcludeLength();
            }}
          />
        </ListItem>
        <ListItem>
          <Typography sx={{ minWidth: MIN_DIWTH }}>抽選方式を選ぶ</Typography>
          <FormControl>
            <FormLabel>抽選方式</FormLabel>
            <RadioGroup
              value={props.dispersion === undefined ? 'random' : 'dispersion'}
              onChange={(e) => {
                switch (e.target.value) {
                  case 'random':
                    props.setDispersion(undefined);
                    break;
                  case 'dispersion':
                    props.setDispersion({});
                    break;
                  default:
                    break;
                }
              }}
            >
              <FormControlLabel
                label="ランダム"
                value={'random'}
                control={<Radio />}
              />
              <FormControlLabel
                label="重み付け"
                value={'dispersion'}
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>
        </ListItem>
        {/* 重み付けの設定 */}
        {props.dispersion === undefined ? (
          <></>
        ) : (
          <>
            <ListItem>
              <Typography sx={{ minWidth: MIN_DIWTH }}>
                直近のデータ数
              </Typography>
              <TextField
                helperText={termsError}
                value={props.terms}
                onChange={(e) => {
                  props.setTerms(e.target.value);
                  const validate = PredictQuantityValidator.safeParse(
                    Number(e.target.value),
                  );
                  if (!validate.success && e.target.value !== '') {
                    // 空文字はundefinedとして許容する
                    setTermsError('1以上の整数で入力してください');
                  } else {
                    setTermsError('');
                  }
                }}
              />
            </ListItem>
            <ListItem>
              <Typography sx={{ minWidth: MIN_DIWTH }}>重みの優先度</Typography>
              <FormControl>
                <FormLabel>使用する重み</FormLabel>
                <RadioGroup
                  value={props.reverse}
                  onChange={() => {
                    // true, false を入れ替える
                    props.setReverse(!props.reverse);
                  }}
                >
                  <FormControlLabel
                    label="出た回数が多い順"
                    value={false}
                    control={<Radio />}
                  />
                  <FormControlLabel
                    label="出た回数が少ない順"
                    value={true}
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
          </>
        )}
        <ListItem>
          <SimpleButton
            title="抽選"
            color="info"
            disabled={
              quantityError !== '' ||
              necessaryNumbersError !== '' ||
              excludeNumbersError !== '' ||
              termsError !== ''
            }
            onClick={async () => {
              await props.handlePredictRequest();
              setExpand(false);
            }}
          />
        </ListItem>
      </List>
    </Accordion>
  );
}
