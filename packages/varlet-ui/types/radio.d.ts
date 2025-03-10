import { VarComponent } from './varComponent'

type ValidateTriggers = 'onChange'

interface RadioProps {
  modelValue?: any
  checkedValue?: any
  uncheckedValue?: any
  checkedColor?: string
  uncheckedColor?: string
  disabled?: boolean
  readonly?: boolean
  iconSize?: string | number
  ripple?: boolean
  validateTrigger?: Array<ValidateTriggers>
  rules?: Array<(value: any) => any>
  onClick?: (e: Event) => void
  onChange?: (value: any) => void
  'onUpdate:modelValue'?: (value: any) => void
}

export class Radio extends VarComponent {
  $props: RadioProps

  validate(): Promise<boolean>

  resetValidation(): void

  reset(): void

  toggle(value: any): void
}
