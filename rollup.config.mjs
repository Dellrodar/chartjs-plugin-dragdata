import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from "@rollup/plugin-terser";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

function buildOutput (file,format,terse) {
  return {
    input: 'src/index.js',
    external: [
      'chart.js',
      'chart.js/helpers'
    ],
    output: {
      name: 'index',
      file: file,
      format: format,
      exports: 'auto',
      globals: {
        'chart.js': 'Chart',
        'chart.js/helpers': 'Chart.helpers'
      },
      esModule: true,
      generatedCode: {
        reservedNamesAsProps: false
      },
		  interop: 'compat',
		  systemNullSetters: false
    },
    makeAbsoluteExternalsRelative: true,
	  preserveEntrySignatures: 'strict',
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      terse ? terser() : undefined
    ]
  }
}

export default [
  // main outputs to dist folder
  buildOutput(pkg.main,'umd',false),
  buildOutput(pkg.browser,'umd',true),
  buildOutput(pkg.module,'es',true),
  // as well as the docs/assets one
  buildOutput('docs/assets/chartjs-plugin-dragdata.min.js','umd',true),
]
