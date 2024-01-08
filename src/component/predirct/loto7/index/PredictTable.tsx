import { PredictElementParams } from "@/types/api/predict/loto7";
import {
  Accordion,
  AccordionSummary,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getColorByFrequence } from "../../../search/loto7/AllNumberTable";
import { useState } from "react";

type PredictTableProps = {
  titile: string,
  predict: PredictElementParams,
};

export default function PredictTable(props: PredictTableProps) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <Accordion sx={{ minWidth: 800 }}
      expanded={isExpand}
      onChange={() => setIsExpand(!isExpand)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          {props.titile}
          {isExpand ? '' : props.predict.result.map(item => (
            <>
              <TableCell sx={{ backgroundColor: getColorByFrequence(item.frequency) }}>{item.number}</TableCell>
            </>
          ))}
        </Typography>
      </AccordionSummary>
      {/* 各データの情報 */}
      <List>
        <ListItem>
          <Table sx={{ maxWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>番号</TableCell>
                <TableCell align="right">期間内に出た回数</TableCell>
                <TableCell align="right">最後に選ばれた抽選回</TableCell>
                <TableCell align="right">日付</TableCell>
              </TableRow>
            </TableHead>
            {props.predict.result.map(item => (
              <>
                <TableBody>
                  <TableCell sx={{
                    height: 30,
                    width: 30,
                    backgroundColor: getColorByFrequence(item.frequency)
                  }}>
                    {item.number}
                  </TableCell>
                  <TableCell align="right">{item.amount}</TableCell>
                  <TableCell align="right">{item.last_picked.id}</TableCell>
                  <TableCell align="right">{item.last_picked.date}</TableCell>
                </TableBody>
              </>
            ))}
          </Table>
        </ListItem>
      </List>
      {/* 抽選結果の類似番号 */}
      <Accordion sx={{ backgroundColor: "#E1F5FE" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {`類似した数字が出た抽選回 ( 最大で ${props.predict.similar_pick.count_same_number}桁 同じ )`}
          </Typography>
        </AccordionSummary>
        <List>
          <ListItem>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">抽選回</TableCell>
                  <TableCell align="right">日付</TableCell>
                  <TableCell>番号</TableCell>
                </TableRow>
              </TableHead>
              {props.predict.similar_pick.has_same_number.map(item => (
                <>
                  <TableBody>
                    <TableRow>
                      <TableCell align="right">{item.id}</TableCell>
                      <TableCell align="right">{item.date}</TableCell>
                      {item.numbers.map(i => (
                        <>
                          <TableCell
                            sx={{
                              backgroundColor: (
                                // 抽選した数とかぶっていればハイライトする
                                props.predict.result.map(item => item.number).indexOf(i) > -1 ?
                                  "#BDBDBD" : ""
                              )
                            }}
                          >
                            {i}
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  </TableBody>
                </>
              ))}
            </Table>
          </ListItem>
        </List>
      </Accordion>
    </Accordion>
  )
}