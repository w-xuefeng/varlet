import { resolve } from 'path'

export const CWD = process.cwd()
export const POSTCSS_CONFIG = resolve(CWD, 'postcss.config.js')
export const TS_CONFIG = resolve(CWD, 'tsconfig.json')
export const VARLET_CONFIG = resolve(CWD, 'varlet.config.js')
export const SRC_DIR = resolve(CWD, 'src')
export const ES_DIR = resolve(CWD, 'es')
export const CJS_DIR = resolve(CWD, 'cjs')
export const UMD_DIR = resolve(CWD, 'umd')
export const TYPES_DIR = resolve(CWD, 'types')
export const ROOT_DOCS_DIR = resolve(CWD, 'docs')
export const EXTENSIONS = ['.vue', '.ts', '.js', '.less', '.css']
export const EXAMPLE_DIR_NAME = 'example'
export const DOCS_DIR_NAME = 'docs'
export const EXAMPLE_DIR_INDEX = 'index.vue'
export const TESTS_DIR_NAME = '__tests__'
export const PRIMARY_COLOR = '#2979ff'

// site
export const SITE_MOBILE_MAIN = resolve(__dirname, '../../site/mobile/main.ts')
export const SITE_MOBILE_ROUTES = resolve(__dirname, '../../site/mobile/routes.ts')
export const SITE_PC_MAIN = resolve(__dirname, '../../site/pc/main.ts')
export const SITE_PC_ROUTES = resolve(__dirname, '../../site/pc/routes.ts')
export const SITE_CONFIG = resolve(__dirname, '../../site/site.config.json')
export const SITE_OUTPUT_PATH = resolve(CWD, 'site')

// template highlight
export const HL_COMPONENT_NAME_RE = /.*(\/|\\)(.+)(\/|\\)docs(\/|\\)/
export const HL_API_RE = /##\s*API\n+/
export const HL_TITLE_ATTRIBUTES_RE = /###\s*属性\s*\n+/
export const HL_TITLE_EVENTS_RE = /###\s*事件\s*\n+/
export const HL_TITLE_SLOTS_RE = /###\s*插槽\s*\n+/
export const HL_MD = 'zh-CN.md'
export const HL_DIR = resolve(CWD, 'highlight')
export const HL_TAGS_JSON = resolve(HL_DIR, 'tags.json')
export const HL_ATTRIBUTES_JSON = resolve(HL_DIR, 'attributes.json')
export const HL_WEB_TYPES_JSON = resolve(HL_DIR, 'web-types.json')

// jest
export const JEST_CONFIG = resolve(__dirname, '../config/jest.config.js')
export const JEST_MEDIA_MOCK = resolve(__dirname, '../config/jest.media.mock.js')
export const JEST_STYLE_MOCK = resolve(__dirname, '../config/jest.style.mock.js')
