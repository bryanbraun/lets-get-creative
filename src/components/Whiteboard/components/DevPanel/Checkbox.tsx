import * as Label from '@radix-ui/react-label'
import {
  Root,
  Indicator,
  CheckboxProps as CheckboxOwnProps,
} from '@radix-ui/react-checkbox'
import styles from './Checkbox.module.css'

interface CheckboxProps extends CheckboxOwnProps {
  name: string
}

export function Checkbox(props: CheckboxProps) {
  return (
    <>
      <Label.Root dir="ltr" htmlFor={props.name}>
        {props.name}
      </Label.Root>
      <Root {...props} dir="ltr" className={styles.root} id={props.name}>
        <Indicator className={styles.indicator} />
      </Root>
      <div />
    </>
  )
}
