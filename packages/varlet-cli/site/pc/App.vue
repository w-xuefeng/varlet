<template>
  <div class="varlet-site" v-if="!isLoading">
    <div class="varlet-site-header">
      <div class="varlet-site-header__logo">
        <img :src="header.logo" alt="" />
        <span>{{ title }}</span>
      </div>
      <div class="varlet-site-header__nav">
        <div class="varlet-site-header__nav-style" @mouseenter="isOpenMenu = true" @mouseleave="isOpenMenu = false">
          <var-icon name="translate" size="26px" color="#666" />

          <var-icon name="chevron-down" color="#666" />

          <transition name="fade">
            <div
              class="language-list var-elevation--5"
              v-show="isOpenMenu"
              :style="{ pointerEvents: isOpenMenu ? 'auto' : 'none' }"
            >
              <var-cell
                v-for="(value, key) in languageList"
                :key="key"
                :class="{ 'language-list__active': language === key }"
                @click="changeLanguage(key)"
              >
                {{ value }}
              </var-cell>
            </div>
          </transition>
        </div>
        <a target="_blank" href="https://github.com/haoziqaq/varlet" class="varlet-site-header__nav-link">
          <var-icon name="github" color="#666" :size="28" />
        </a>
      </div>
    </div>
    <div class="varlet-site-content">
      <div class="varlet-site-nav var-elevation--3" ref="refs">
        <var-cell
          v-for="(item, index) in menu"
          class="varlet-site-nav__item"
          :class="{
            'varlet-site-nav__item--active': item.doc === currentMenuName,
            'varlet-site-nav__link': !item.isTitle,
            'varlet-site-nav__title': item.isTitle,
          }"
          v-ripple="{ touchmoveForbid: false, disabled: !!item.isTitle, color: '#2979ff' }"
          @click="changeRoute(item)"
          :key="index"
        >
          <span v-if="item.isTitle" class="varlet-site-nav__item--title">{{ item.text[language] }}</span>
          <span v-else class="varlet-site-nav__item--link">
            {{ item.text[language] }}
          </span>
        </var-cell>
      </div>
      <div class="varlet-site-code" ref="codeRefs">
        <router-view />
      </div>
      <div class="varlet-site-mobile var-elevation--3">
        <div class="varlet-site-mobile-content">
          <iframe :src="`./mobile.html#/${componentName}?language=${language}&platform=pc&path=${path}`"></iframe>
        </div>
      </div>
    </div>
  </div>
  <var-loading class="varlet-pc__loading" style="color: #2979ff" v-else />
</template>

<script lang="ts">
// @ts-ignore
import config from '@config'
import Ripple from '@varlet/ui/es/ripple'
import Cell from '@varlet/ui/es/cell'
import Icon from '@varlet/ui/es/icon'
import Menu from '@varlet/ui/es/menu'
import Loading from '@varlet/ui/es/loading'
import '@varlet/ui/es/ripple/style'
import '@varlet/ui/es/cell/style'
import '@varlet/ui/es/icon/style'
import '@varlet/ui/es/menu/style'
import '@varlet/ui/es/loading/style'
import { defineComponent, ref, Ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

type Menu = {
  isTitle: boolean
  nonComponent: boolean
  doc: string
  text: Record<string, string>
}

type Header = {
  i18nButton: Record<string, string>
  logo: string
  search: Record<string, string>
}

type Language = Record<string, string>

export default defineComponent({
  directives: { Ripple },
  components: {
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Menu.name]: Menu,
    [Loading.name]: Loading,
  },

  setup() {
    const { pc = {}, title: configTitle } = config
    const { header: configHeader = { i18nButton: {}, logo: '', search: {} }, menu: configMenu = [] } = pc
    const menu: Ref<Menu[]> = ref(configMenu)
    const language: Ref<string> = ref('')
    const header: Ref<Header> = ref(configHeader)
    const componentName: Ref<null | string> = ref(null)
    const title: Ref<string> = ref(configTitle)
    const currentMenuName: Ref<string> = ref('')
    const refs: Ref<HTMLElement | null>  = ref(null)
    const codeRefs: Ref<HTMLElement | null> = ref(null)
    const route = useRoute()
    const languageList: Ref<Language> = ref(config.pc.header.language)
    const isOpenMenu: Ref<boolean> = ref(false)
    const path: Ref<string | null> = ref(null)
    const isBack: Ref<boolean> = ref(false)
    const isPhone: Ref<boolean> = ref(false)
    const isLoading: Ref<boolean> = ref(true)

    isPhone.value = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)

    const judgmentType = (type: string) => {
      const [, languageValue, componentValue] = window.location.hash.split('/')

      isLoading.value = false

      path.value = componentValue || 'home'

      if (type && isPhone.value) {
        window.location.href = `./mobile.html#/${path.value}?language=${
          languageValue || 'zh-CN'
        }&platform=mobile&path=${path.value}`
      }

      nextTick(() => {
        const childrenElement = refs.value.getElementsByClassName('var-cell')
        const index = menu.value.findIndex((item) => item.doc === componentValue)

        if (index !== -1) {
          childrenElement[index].scrollIntoView({
            block: 'center',
            inline: 'start',
          })
        }
      })
    }

    const changeRoute = (item) => {
      const [, , componentValue] = window.location.hash.split('/')
      if (item.isTitle || componentValue === item.doc) {
        return false
      }

      codeRefs.value.scrollTop = 0
      isBack.value = false
      componentName.value = item.doc
      path.value =  item.doc
    }

    const changeLanguage = (key) => {
      language.value = key
      componentName.value = route.fullPath.split('/')[2]
      isOpenMenu.value = false
    }

    onMounted(() => {
      judgmentType('mounted')
    })

    watch(
      () => route.path,
      (to: string) => {
        if (to === '/') return

        const [, languageValue, name] = to.split('/')
        currentMenuName.value = name
        language.value = languageValue
        document.title = config.pc.title[languageValue]

        const currentNonComponent = menu.value.find((c) => c.doc === currentMenuName.value)?.nonComponent ?? false
        componentName.value = currentNonComponent ? 'home' : currentMenuName.value

        isBack.value ? judgmentType('') : (isBack.value = true)
      },
      { immediate: true }
    )

    return {
      menu,
      language,
      header,
      componentName,
      currentMenuName,
      title,
      languageList,
      isOpenMenu,
      isLoading,
      path,
      codeRefs,
      refs,
      changeRoute,
      changeLanguage,
    }
  },
})
</script>

<style>
.hljs {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 4px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

@keyframes scale-animation {
  0% {
    transform: scale(0.9);
  }

  50% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.9);
  }
}
</style>

<style lang="less">
@import '~@varlet/ui/es/styles/var';
@import '~@varlet/ui/es/styles/elevation';

body {
  min-width: 1200px;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

.varlet {
  &-introduce {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 4px 20px;
    padding: 40px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    border-top: 8px solid #1d92e9;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    &__image {
      width: 180px;
    }

    &__name {
      font-size: 32px;
      margin-top: 22px;
    }

    &__des {
      color: #888;
      font-size: 14px;
      margin-top: 10px;
    }
  }

  &-pc__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-site {
    &-mobile {
      flex: 0 0 325px;
      position: relative;
      height: calc(100vh - 100px);
      align-self: center;
      margin-left: 30px;
      margin-right: 38px;
      overflow: hidden;
      border-radius: 8px;

      &-content {
        width: 100%;
        height: 100%;
      }

      &-image {
        width: 100%;
        pointer-events: none;
        height: 100%;
        top: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    &-header {
      display: flex;
      align-items: center;
      color: #555;
      height: 60px;
      padding: 0 30px;
      justify-content: space-between;
      user-select: none;
      position: relative;
      z-index: 2;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      box-sizing: border-box;

      &__logo {
        display: flex;
        align-items: center;

        img {
          width: 32px;
          margin-right: 12px;
          flex-shrink: 0;
        }

        span {
          font-size: 22px;
        }
      }

      &__nav {
        display: flex;
        align-items: center;

        .var-menu {
          background: transparent;
          margin-right: 20px;
          cursor: pointer;
        }

        &-style {
          border-radius: 3px;
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.08);
          }
        }

        &-link {
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background-color 0.3s;
          cursor: pointer;
          text-decoration: none;

          a {
            text-decoration: none;
          }

          &:hover {
            background: rgba(0, 0, 0, 0.08);
          }
        }
      }

      &__cube {
        display: inline-block;
        padding: 0 12px;
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-radius: 20px;
        outline: none;
        cursor: pointer;
        background: transparent;
        transition: 0.3s ease-in-out;
      }

      &__version {
        margin-right: 24px;
        position: relative;
        padding-right: 20px;

        &::after {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 5px;
          height: 5px;
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid;
          border-color: transparent transparent currentColor currentColor;
          transform: rotate(-45deg);
          content: '';
        }
      }

      &__version-pop {
        position: absolute;
        top: 30px;
        right: 0;
        left: 0;
        z-index: 99;
        color: #333;
        line-height: 36px;
        text-align: left;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px #ebedf0;
        transform-origin: top;
        transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      &__version-pop-hidden {
        transform: scaleY(0);
        opacity: 0;
      }

      &__version-pop-item {
        padding-left: 12px;
        display: inline-block;
        width: 100%;
        transition: 0.2s;

        &:hover {
          color: #1989fa;
        }
      }
    }

    &-content {
      height: calc(100vh - 60px);
      display: flex;
      background: #fff;
    }

    &-doc {
      a {
        display: inline-block;
        margin: 0 4px;
        color: @color-warning;
        text-decoration: none;
        animation: scale-animation 1.2s infinite linear;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: #323233;
        font-weight: normal;
        line-height: 1.5;
      }

      h1 {
        //margin: 0 0 30px;
        line-height: 40px;
        font-size: 30px;
        cursor: default;
      }

      h2 {
        margin: 30px 0 20px;
        font-size: 25px;
      }

      h3 {
        margin-bottom: 16px;
        font-size: 18px;
      }

      p,
      ul {
        color: #888;
        font-size: 15px;
        line-height: 26px;
        padding: 16px;
        border-left: 4px solid #1d92e9;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
        list-style: none;
      }

      pre {
        margin: 20px 0 0;
      }

      code {
        position: relative;
        display: block;
        padding: 16px;
        overflow-x: auto;
        color: #58727e;
        font-size: 13px;
        font-family: Consolas, Monaco, monospace;
        line-height: 26px;
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #fff;
      }

      p code,
      li code,
      table code {
        display: inline;
        margin: 0 2px;
        padding: 2px 5px;
        font-size: 14px;
        font-family: inherit;
        word-break: keep-all;
        color: @color-primary;
        -webkit-font-smoothing: antialiased;
      }

      table {
        width: 100%;
        margin-top: 12px;
        color: #34495e;
        font-size: 14px;
        line-height: 1.5;
        border-collapse: collapse;

        th {
          padding: 8px 10px;
          font-weight: 600;
          text-align: left;

          &:first-child {
            padding-left: 0;
          }
        }

        td {
          padding: 8px;
          border-top: 1px solid #f1f4f8;

          code {
            white-space: nowrap;
          }

          &:first-child {
            padding-left: 0;

            code {
              margin: 0;
              padding: 2px 6px;
              color: #1989fa;
              font-weight: 600;
              font-size: 11px;
              background-color: rgba(25, 137, 250, 0.1);
              border-radius: 20px;
            }
          }
        }

        em {
          color: #4fc08d;
          font-size: 14px;
          font-family: 'Roboto', sans-serif;
          font-style: normal;
        }
      }

      .card {
        margin-bottom: 24px;
        padding: 0 4px;
      }
    }

    &-nav {
      padding: 5px 0 15px;
      position: sticky;
      flex: 0 0 220px;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      overflow-y: scroll;
      box-shadow: 0 8px 12px #ebedf0;
      background: #fff;

      &::-webkit-scrollbar {
        display: none;
      }

      &__item {
        margin: 0;
        user-select: none;
        padding: 10px 28px;

        &--title {
          font-size: 16px;
          font-weight: 600;
          color: #394950;
          line-height: 28px;
          padding: 8px 0 8px;
        }

        &--link {
          font-size: 14px;
          color: #455a64;
          transition: color 0.2s;

          &:hover {
            color: @color-primary;
          }
        }

        &--active {
          position: relative;
          background: #2b79fc21;

          span {
            color: @color-primary;
          }

          &::before {
            display: block;
            content: '';
            background: @color-primary;
            width: 4px;
            height: 40px;
            position: absolute;
            left: 0;
          }
        }
      }

      &__link {
        cursor: pointer;
      }

      &__title {
        margin-top: 10px;
      }
    }

    &-code {
      flex: 1 0 0;
      overflow-y: auto;
      min-width: 500px;
      padding-left: 30px;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}

.language-list {
  background: #fff;
  cursor: pointer;
  color: #666;
  border-radius: 2px;
  position: absolute;
  top: 40px;
  left: -20px;

  &__active {
    background: #edf5ff;
    color: @color-primary;
  }

  .var-cell {
    width: 100px;

    &:hover {
      background: #edf5ff;
      color: @color-primary;
    }
  }
}

.fade-enter-active {
  animation-name: fade-in;
  animation-duration: 0.3s;
}

.fade-leave-active {
  animation-name: fade-leave;
  animation-duration: 0.3s;
}

@keyframes fade-in {
  0% {
    top: 30px;
    opacity: 0;
  }
  100% {
    top: 40px;
    opacity: 1;
  }
}

@keyframes fade-leave {
  0% {
    top: 40px;
    opacity: 1;
  }
  100% {
    top: 30px;
    opacity: 0;
  }
}
</style>
