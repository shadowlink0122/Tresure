import {
  Divider,
  Typography,
} from '@mui/material';
import { GetDescription } from '@/libs/CategoryInfomation';

type TresureMenuProps = {
  path: string
};

export default function TresureHeader(props: TresureMenuProps) {
  return (
    <>
      <Typography sx={{ height: 20 }}></Typography>
      {GetDescription(props.path).split('\n').map(item => {
        return (
          <>
            <Typography sx={{ minHeight: 30 }}>
              {item}
            </Typography>
          </>
        )
      })}
      <Divider />
    </>
  )
}