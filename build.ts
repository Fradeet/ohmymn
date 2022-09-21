import { build } from "@ourongxing/estrella"
import { Plugin } from "esbuild"
import { mainfest } from "./mainfest"
import copy from "esbuild-plugin-mxn-copy"
import autoImport from "unplugin-auto-import/esbuild"
import { homedir } from "os"
import fs from "fs-extra"
import { exec } from "child_process"

const isProd = process.env.NODE_ENV === "production"

const bannerText = `
/*
THIS IS A GENERATED/BUNDLED FILE BY ESBuild

MIT License
Copyright (c) 2022 MarginNote

If you want to view the source code, please visit the github repository.
Github: ${mainfest.github}
Welcome to contribute to this project!
*/

try {
`

const footerText = `
} catch (e) {
  JSB.log("${mainfest.key}-error %@", String(e))
}
`
const outDir = isProd
  ? "./dist/"
  : homedir() +
    `/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/marginnote.extension.${mainfest.key}/`

function clear(): Plugin {
  return {
    name: "Clear",
    setup(build) {
      build.onStart(() => {
        if (fs.existsSync(outDir)) {
          fs.rmSync(outDir, { recursive: true })
        }
      })
    }
  }
}

function zip(): Plugin {
  return {
    name: "Zip",
    setup(build) {
      build.onEnd(() => {
        if (isProd && fs.existsSync(outDir)) {
          const fileName = `${mainfest.key} v${mainfest.version}`.replace(
            /[ .]/g,
            "_"
          )
          exec(`cd ${outDir} && zip -qr ${fileName}.mnaddon *`)
          console.log(`Generated at ${outDir}${fileName}.mnaddon`)
        }
      })
    }
  }
}

function genMainfest(): Plugin {
  return {
    name: "GenMainfest",
    setup(build) {
      build.onEnd(() => {
        const mnaddon = {
          addonid: `marginnote.extension.${mainfest.key}`,
          // author: mainfest.author,
          author: "MN(ourongxing",
          title: mainfest.title,
          version: mainfest.version,
          marginnote_version_min: mainfest.minMarginNoteVersion,
          cert_key: ""
        }
        if (fs.existsSync(outDir))
          fs.writeJSONSync(outDir + "mnaddon.json", mnaddon, { spaces: 2 })
      })
    }
  }
}

const plugins: Plugin[] = [
  clear(),
  !isProd &&
    autoImport({
      imports: [
        {
          "~/sdk": ["console"]
        }
      ],
      dts: false
    }),
  genMainfest(),
  mainfest.files?.length &&
    copy({
      copy: mainfest.files.map(k => ({
        from: k,
        to: outDir
      }))
    }),
  isProd && zip()
].filter(k => k)

build({
  entry: "src/main.ts",
  tslint: !isProd,
  outfile: outDir + "main.js",
  format: "esm",
  splitting: false,
  sourcemap: false,
  clear: true,
  watch: !isProd,
  minify: isProd,
  banner: {
    js: bannerText
  },
  footer: {
    js: footerText
  },
  pure: ["console.log", "console.error", "console.assert", "console.warn"],
  bundle: true,
  target: "safari10",
  plugins
})
