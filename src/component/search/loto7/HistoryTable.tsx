import { LOTO7 } from '@/types/loto7';
import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Accordion,
  AccordionSummary,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type HistoryTableDataProps = {
  title: string;
  loto7: LOTO7[];
};

export default function HistoryTable(props: HistoryTableDataProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <FormControl fullWidth>
        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ロト７抽選</TableCell>
                <TableCell align="right">本番号</TableCell>
                <TableCell align="right">ボーナス番号</TableCell>
                <TableCell align="right">抽選日</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.loto7.map((item) => (
                <TableRow
                  key={item.implemention}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.implemention}
                  </TableCell>
                  <TableCell align="right">
                    {item.mainNumber.join(' ')}
                  </TableCell>
                  <TableCell align="right">
                    {item.bonusNumber.join(' ')}
                  </TableCell>
                  <TableCell align="right">{item.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FormControl>
    </Accordion>
  );
}
