import { PredictResultParams, PredictResultIsSameParams } from "@/types/api/predict/loto7/result";
import { Accordion, AccordionSummary, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PredictPickMethod } from "@/types/api/predict/loto7";

type PredictResultProps = {
  title: string,
  result: PredictResultParams[]
}

export default function PredictResultTable(props: PredictResultProps) {
  const getPickMethodName = (method: PredictPickMethod) => {
    switch (method) {
      case 'dispersion':
        return '重み付け';
      case 'random':
        return 'ランダム';
      default:
        break;
    }
    return '';
  }
  const getColor = (isSame: PredictResultIsSameParams) => {
    switch (isSame) {
      case 'main':
        return '#b39ddb';
      case 'bonus':
        return '#90caf9';
      default:
        break;
    }
    return '';
  }

  const handleGetSubTitle = () => {
    let subTitle = '';
    const randomLength = props.result.filter(item => item.pick_method === 'random').length;
    const dispersionLength = props.result.filter(item => item.pick_method === 'dispersion').length;
    if (randomLength > 0) subTitle += `ランダム: ${randomLength},\n`;
    if (dispersionLength > 0) subTitle += `重み付け: ${dispersionLength}`;
    return (
      <>
        {subTitle}
      </>
    );
  }

  return (
    <Accordion sx={{ minWidth: 500 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {props.title}<br />
          {handleGetSubTitle()}
        </Typography>
      </AccordionSummary>
      <List>
        <ListItem>
          <Table>
            <TableHead>
              <TableCell sx={{ width: 100 }}>抽選方式</TableCell>
              <TableCell>指定期間</TableCell>
              <TableCell>分布</TableCell>
              <TableCell>番号</TableCell>
            </TableHead>

            {props.result.map(item => (
              <>
                <TableBody>
                  <TableRow>
                    <TableCell>{getPickMethodName(item.pick_method)}</TableCell>
                    <TableCell>
                      {
                        (item.pick_method === 'dispersion') ? (item.dispersion!.terms ? item.dispersion!.terms : '全て')
                          : ''
                      }
                    </TableCell>
                    <TableCell>
                      {
                        (item.pick_method === 'dispersion') ? (!item.dispersion!.reverse ? '多い順' : '少ない順')
                          : ''
                      }
                    </TableCell>
                    {item.numbers.map(num => (
                      <>
                        <TableCell
                          sx={{ backgroundColor: getColor(num.is_same) }}
                        >
                          {num.number}
                        </TableCell>
                      </>
                    ))}
                  </TableRow>
                </TableBody>
              </>
            ))}
          </Table>
        </ListItem>
      </List >
    </Accordion >
  )
}
