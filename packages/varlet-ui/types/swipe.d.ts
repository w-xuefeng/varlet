import { VarComponent } from './varComponent'

interface SwipeProps {
  loop?: boolean
  autoplay?: string | number
  duration?: string | number
  initialIndex?: string | number
  indicator?: boolean
  indicatorColor?: string
  vertical?: boolean
  touchable?: boolean
  onChange?: (index: number) => void
}

export class Swipe extends VarComponent {
  $props: SwipeProps

  resize(): void

  prev(): void

  next(): void

  to(index: number): void
}
