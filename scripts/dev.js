import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import esbuild from 'esbuild'
import { createRequire } from 'node:module'
const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',

      default: 'esm',
    },
  },
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)

const target = positionals.length ? positionals[0] : 'vue'

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

/**
 * --format cjs or esm
 * cjs => reactive.cjs.js
 * esm => reactive.esm.js
 * @type {string}
 */

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`,
)

const pkg = require(`../packages/${target}/package.json`)

esbuild
  .context({
    entryPoints: [entry], // 入口文件
    outfile, // 输出文件
    format, // 打包格式
    sourcemap: true, // 开启sourcemap方便调试
    bundle: true, // 把所有依赖打包到一个文件中
    globalName: pkg.buildOptions.name,
  })
  .then(ctx => {
    // 监听文件变化
    return ctx.watch()
  })
