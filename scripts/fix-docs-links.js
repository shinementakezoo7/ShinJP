#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const docsDir = path.join(projectRoot, 'docs')

function listMarkdownFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) out.push(...listMarkdownFiles(p))
    else if (stat.isFile() && p.endsWith('.md')) out.push(p)
  }
  return out
}

function stripCodeFences(text) {
  const lines = text.split(/\r?\n/)
  const out = []
  let inFence = false
  for (const line of lines) {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    out.push(inFence ? '' : line)
  }
  return out.join('\n')
}

function isExternal(href) {
  return /^([a-z]+:)?\/\//i.test(href)
}

function normalizeTarget(target) {
  return target.split('#')[0].split('?')[0]
}

function findByBasename(basename) {
  const matches = []
  function search(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const p = path.join(dir, entry)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) search(p)
      else if (stat.isFile() && path.basename(p).toLowerCase() === basename.toLowerCase()) {
        matches.push(p)
      }
    }
  }
  search(docsDir)
  return matches
}

function relativeFrom(fromDir, absTarget) {
  return path.relative(fromDir, absTarget).replace(/\\/g, '/')
}

function fixLinksInFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const content = stripCodeFences(original)
  const dir = path.dirname(filePath)
  let changed = false

  const regex = /!?\[[^\]]*\]\(([^)]+)\)/g
  const replacements = []

  let match
  while ((match = regex.exec(content)) !== null) {
    const rawHref = match[1].trim().replace(/^<|>$/g, '')
    if (!rawHref || rawHref.startsWith('#') || isExternal(rawHref)) continue
    if (/^(mailto:|tel:)/i.test(rawHref)) continue

    const href = normalizeTarget(rawHref)
    let resolved
    if (href.startsWith('/')) {
      // Treat as project-root absolute
      resolved = path.join(projectRoot, href)
    } else {
      resolved = path.resolve(dir, href)
    }

    if (fs.existsSync(resolved)) continue

    // Attempt to fix
    let candidate = null

    // Case: starts with 'docs/' reference from project root
    if (href.startsWith('docs/')) {
      const abs = path.join(projectRoot, href)
      if (fs.existsSync(abs)) {
        candidate = relativeFrom(dir, abs)
      }
    }

    // Case: LICENSE, README.md, CONTRIBUTING.md
    const base = path.basename(href)
    if (!candidate && base.toLowerCase() === 'license') {
      const abs = path.join(projectRoot, 'LICENSE')
      if (fs.existsSync(abs)) candidate = relativeFrom(dir, abs)
    }
    if (!candidate && base.toLowerCase() === 'readme.md') {
      const absDocs = path.join(docsDir, 'README.md')
      if (fs.existsSync(absDocs)) candidate = relativeFrom(dir, absDocs)
    }
    if (!candidate && base.toLowerCase() === 'contributing.md') {
      const absDocs = path.join(docsDir, 'contributing', 'CONTRIBUTING.md')
      if (fs.existsSync(absDocs)) candidate = relativeFrom(dir, absDocs)
    }

    // Case: bare filename (e.g., FINAL_IMPLEMENTATION_STATUS.md)
    if (!candidate && !href.includes('/') && href.toLowerCase().endsWith('.md')) {
      const matches = findByBasename(href)
      if (matches.length === 1) {
        candidate = relativeFrom(dir, matches[0])
      }
    }

    if (candidate) {
      const newHref = candidate
      // Record replacement in original (not stripped) content
      const startIdx = match.index
      const endIdx = regex.lastIndex
      const fullMatch = content.slice(startIdx, endIdx)
      const fullInOriginal = original.slice(startIdx, endIdx)
      const replaced = fullInOriginal.replace(rawHref, newHref)
      replacements.push({ startIdx, endIdx, replaced })
    }
  }

  if (replacements.length) {
    // Apply replacements by reconstructing content
    let output = ''
    let last = 0
    for (const { startIdx, endIdx, replaced } of replacements) {
      output += original.slice(last, startIdx) + replaced
      last = endIdx
    }
    output += original.slice(last)
    fs.writeFileSync(filePath, output, 'utf8')
    changed = true
  }

  return changed
}

function main() {
  if (!fs.existsSync(docsDir)) {
    console.error('Docs directory not found at', docsDir)
    process.exit(1)
  }

  const files = listMarkdownFiles(docsDir)
  let changedCount = 0
  for (const file of files) {
    if (fixLinksInFile(file)) {
      changedCount++
      console.log('Fixed links in', path.relative(projectRoot, file))
    }
  }
  console.log(`\nCompleted. Files updated: ${changedCount}`)
}

try {
  main()
} catch (err) {
  console.error('Link fixing failed:', err)
  process.exit(1)
}
