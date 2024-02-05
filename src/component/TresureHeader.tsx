import {
  Divider,
  Typography,
} from '@mui/material';
import { GetDescription } from '@/libs/CategoryInfomation';

type TresureHeaderProps = {
  path?: string,
  message?: string
};

export default function TresureHeader(props: TresureHeaderProps) {
  const headerText = props.path ? GetDescription(props.path) : props.message!;
  return (
    <>
      <Typography sx={{ height: 20 }}></Typography>
      {headerText.split('\n').map(item => {
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