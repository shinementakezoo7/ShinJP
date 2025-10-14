#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const docsDir = path.join(projectRoot, 'docs')

function getMarkdownFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && fs.statSync(path.join(dir, f)).isFile())
}

function getSubdirs(dir) {
  return fs.readdirSync(dir).filter((name) => fs.statSync(path.join(dir, name)).isDirectory())
}

function titleCase(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)
    for (const raw of lines) {
      const line = raw.trim()
      if (!line) continue
      const m = line.match(/^#{1,6}\s+(.+)$/)
      if (m) {
        return m[1].trim()
      }
      // Fallback: first non-empty line
      return line.replace(/[`*_]/g, '').trim()
    }
  } catch (_) {
    // ignore file read errors
  }
  return ''
}

function buildIndex() {
  if (!fs.existsSync(docsDir)) {
    console.error('Docs directory not found at', docsDir)
    process.exit(1)
  }

  const subdirs = getSubdirs(docsDir).sort()
  const docsRootFiles = getMarkdownFiles(docsDir).sort()

  const lines = []
  lines.push('# Documentation Directory Index')
  lines.push('')
  lines.push('Quick reference guide to find documentation by topic.')
  lines.push('')
  lines.push('## 📂 Directory Structure')
  lines.push('')

  // Emit each subdirectory with file counts and names
  for (const dir of subdirs) {
    const full = path.join(docsDir, dir)
    const files = getMarkdownFiles(full).sort()
    const niceName = titleCase(dir)
    lines.push(`### ${dir}/`)
    lines.push(`Files in ${niceName}.`)
    lines.push('')
    lines.push(`**Files (${files.length}):**`)
    files.forEach((f) => {
      const filePath = path.join(full, f)
      const title = extractTitle(filePath)
      if (title && title.toLowerCase() !== f.toLowerCase()) {
        lines.push(`- ${f} — ${title}`)
      } else {
        lines.push(`- ${f}`)
      }
    })
    lines.push('')
  }

  if (docsRootFiles.length) {
    lines.push('### docs/ root')
    lines.push('Markdown files in docs root.')
    lines.push('')
    lines.push(`**Files (${docsRootFiles.length}):**`)
    docsRootFiles.forEach((f) => {
      const filePath = path.join(docsDir, f)
      const title = extractTitle(filePath)
      if (title && title.toLowerCase() !== f.toLowerCase()) {
        lines.push(`- ${f} — ${title}`)
      } else {
        lines.push(`- ${f}`)
      }
    })
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push(`Generated on: ${new Date().toISOString()}`)

  return lines.join('\n')
}

function writeIndex(content) {
  const outPath = path.join(docsDir, 'DIRECTORY_INDEX.md')
  fs.writeFileSync(outPath, content, 'utf8')
  console.log('Updated', path.relative(projectRoot, outPath))
}

try {
  const content = buildIndex()
  writeIndex(content)
} catch (err) {
  console.error('Failed to generate docs index:', err)
  process.exit(1)
}
