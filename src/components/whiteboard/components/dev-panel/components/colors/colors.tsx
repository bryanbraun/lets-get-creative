import styles from './colors.module.css'
import COLORS from '../../../../colors.json'

interface ColorsProps {
  name: string
  selectedColor: string
  onChange: (color: string) => void
}

export function Colors(props: ColorsProps) {
  return (
    <>
      <span>{props.name}</span>
      <div className={styles.grid}>
        {COLORS.map((color) => {
          return (
            <button
              key={color.name}
              className={
                color.hex === props.selectedColor
                  ? [styles.color, styles.selected].join(' ')
                  : styles.color
              }
              style={{
                backgroundColor: color.hex,
              }}
              onClick={() => props.onChange(color.hex)}
            />
          )
        })}
      </div>
    </>
  )
}
