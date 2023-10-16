import * as React from 'react'
import styles from './ColorBar.module.css'
import COLORS from '../../colors.json'

interface ColorBarProps {
  selectedColor: string
  onChange: (color: string) => void
}

export function ColorBar({
  selectedColor,
  onChange,
}: ColorBarProps) {
  return (
    <div className={styles.colorBar}>
      {COLORS.map((color) => {
        const colorBarColorId = `colorBar-${color.name}`;

        return (
          <div key={color.name} className={styles.color}>
            <input
              type="radio"
              value={color.hex}
              id={colorBarColorId}
              className={styles.colorInput}
              checked={selectedColor === color.hex}
              onChange={() => onChange(color.hex)}
              name="colorBar"
            />
            <label
              className={styles.colorLabel}
              style={{ backgroundColor: color.hex }}
              htmlFor={colorBarColorId}
              title={`Color - ${color.name}`}
            >
              <span className={styles.colorLabelText}>{color.name}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}
