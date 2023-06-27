import { ParserPlugin } from '@babel/parser'
import { parse, SFCDescriptor } from 'vue/compiler-sfc'
import MagicString from 'magic-string'
import { RefTransformOptions, RefTransformResults, shouldTransform, transform } from './transform'
import fs from 'fs'

export function drop(filename: string, injectImport = true) {
  try {
    const code = fs.readFileSync(filename, 'utf-8')
    const { shouldRewrite, script } = transformScript(filename, code, injectImport)
    if (shouldRewrite) {
      fs.writeFileSync(filename, script, 'utf-8')
    }
  } catch (error) {
    console.log(error)
  }
}

export function transformScript(filename: string, code: string, injectImport = true) {
  const descriptor = compileFile(filename, code)
  const { script, scriptSetup } = descriptor
  const s = new MagicString(code)

  const parserPlugins: ParserPlugin[] = []
  if (scriptSetup?.lang === 'ts' || script?.lang === 'ts') {
    parserPlugins.push('typescript')
  }

  let shouldRewrite = false
  const refs: string[] = []
  const helpers: string[] = []

  // normalScript
  if (script && shouldTransform(script.content)) {
    const start = script.loc.start.offset
    const end = script.loc.end.offset
    const { code: normalScriptCode, importedHelpers, rootRefs } = doTransform(
      script.content!,
      { filename, parserPlugins },
      injectImport
    )
    helpers.push(...importedHelpers)
    refs.push(...rootRefs)
    s.overwrite(start!, end!, normalScriptCode)
    shouldRewrite = true
  }
  // scriptSetup
  if (scriptSetup && shouldTransform(scriptSetup.content)) {
    const start = scriptSetup.loc.start.offset
    const end = scriptSetup.loc.end.offset
    const { code: scriptSetupCode, importedHelpers, rootRefs } = doTransform(
      scriptSetup.content!,
      { filename, parserPlugins },
      injectImport
    )
    helpers.push(...importedHelpers)
    refs.push(...rootRefs)
    s.overwrite(start!, end!, scriptSetupCode)
    shouldRewrite = true
  }

  return {
    shouldRewrite,
    rootRefs: refs,
    importedHelpers: helpers,
    script: s.toString()
  }
}

export function doTransform(content: string, {
  filename,
  parserPlugins,
  importHelpersFrom = 'vue',
}: RefTransformOptions = {},
  injectImport: boolean = true
): RefTransformResults {
  const s = new MagicString(content)
  const { code, importedHelpers, rootRefs } = transform(content, {
    filename,
    parserPlugins,
    importHelpersFrom
  })

  const newCode = injectImport ? updateImports(code, importedHelpers) : code
  s.overwrite(0, content.length, newCode)
  return {
    code: s.toString(),
    importedHelpers,
    rootRefs
  }
}

function updateImports(content: string, imports: string[]) {
  if (!imports.length) return content
  
  const s = new MagicString(content)
  const vueImport = content.match(/import\s+{([^}]+)}\s+from\s+['"]vue['"]/)
  if (vueImport) {
    const vueImportVars = vueImport[1].split(',').map(v => v.trim())
    const newVars = imports.filter(v => !vueImportVars.includes(v))
    if (newVars.length) {
      const newImport = `import { ${[...vueImportVars, ...newVars].join(', ')} } from 'vue'`
      const startIndex = vueImport.index! 
      s.overwrite(startIndex, startIndex + vueImport[0].length, newImport)
    }
  } else {
    const newImport = `\nimport { ${imports.join(', ')} } from 'vue'\n`
    s.prepend(newImport)
  }
  return s.toString()
}

export function compileFile(filename: string, code: string): SFCDescriptor {
  const { errors, descriptor } = parse(code, {
    filename,
    sourceMap: true
  })

  if (errors.length) {
    console.log(errors)
  }

  return descriptor
}
