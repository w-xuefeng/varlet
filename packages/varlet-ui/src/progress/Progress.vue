<template>
  <div class="var-progress">
    <div class="var-progress-linear" v-if="mode === 'linear'">
      <div class="var-progress-linear__block" :style="{ height: `${lineWidth}px` }" v-bind="$attrs">
        <div class="var-progress-linear__background" :style="{ background: trackColor }"></div>
        <div
          :class="`var-progress-linear__certain${ripple ? ' var-progress-linear__ripple' : ''}`"
          :style="{ background: color, width: linearProps.width }"
        ></div>
      </div>
      <div class="var-progress-linear__label" v-bind="$attrs" v-if="label">
        <slot>
          {{ linearProps.roundValue }}
        </slot>
      </div>
    </div>

    <div class="var-progress-circle" v-if="mode === 'circle'" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg
        class="var-progress-circle__svg"
        :style="{ transform: `rotate(${rotate - 90}deg)` }"
        :viewBox="circleProps.viewBox"
      >
        <circle
          v-if="track"
          class="var-progress-circle__background"
          :cx="size / 2"
          :cy="size / 2"
          :r="circleProps.radius"
          fill="transparent"
          :stroke-width="lineWidth"
          :style="{
            strokeDasharray: circleProps.perimeter,
            stroke: trackColor,
          }"
        ></circle>
        <circle
          class="var-progress-circle__certain"
          :cx="size / 2"
          :cy="size / 2"
          :r="circleProps.radius"
          fill="transparent"
          :stroke-width="lineWidth"
          :style="{
            strokeDasharray: circleProps.strokeDasharray,
            stroke: color,
          }"
        ></circle>
      </svg>

      <div class="var-progress-circle__label" v-if="label" v-bind="$attrs">
        <slot>
          {{ circleProps.roundValue }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { props } from './props'
import { toNumber } from '../utils/shared'

export default defineComponent({
  name: 'VarProgress',
  inheritAttrs: false,
  props,
  setup(props) {
    const linearProps = computed(() => {
      const value = toNumber(props.value)
      const width = value > 100 ? 100 : value
      const roundValue = value > 100 ? 100 : Math.round(value)

      return {
        width: `${width}%`,
        roundValue: `${roundValue}%`,
      }
    })

    const circleProps = computed(() => {
      const { size, lineWidth, value } = props
      const viewBox = `0 0 ${size} ${size}`
      const roundValue = toNumber(value) > 100 ? 100 : Math.round(toNumber(value))
      const radius = (size - toNumber(lineWidth)) / 2
      const perimeter = 2 * Math.PI * radius
      const strokeDasharray = `${(roundValue / 100) * perimeter}, ${perimeter}`

      return {
        viewBox,
        radius,
        strokeDasharray,
        perimeter,
        roundValue: `${roundValue}%`,
      }
    })
    return {
      linearProps,
      circleProps,
    }
  },
})
</script>

<style lang="less">
@import './progress';
</style>
