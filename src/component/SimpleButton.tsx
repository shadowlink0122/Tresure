import { Button } from "@mui/material"

type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

type SimpleButtonProps = {
  title: string,
  color: ButtonColor,
  disabled: boolean,
  onClick: () => {},
};

export default function SimpleButton(props: SimpleButtonProps) {
  return (
    <Button
      title={props.title}
      color={props.color}
      variant="contained"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.title}
    </Button>
  )
}
