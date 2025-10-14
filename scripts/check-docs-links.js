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

function normalizeTarget(target) {
  // Remove any anchor or query
  return target.split('#')[0].split('?')[0]
}

function isExternal(href) {
  return /^([a-z]+:)?\/\//i.test(href)
}

function stripCodeFences(text) {
  const lines = text.split(/\r?\n/)
  const out = []
  let inFence = false
  for (const line of lines) {
    if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
      inFence = !inFence
      // keep fence line but blank it to avoid false link matches
      out.push('')
      continue
    }
    if (inFence) {
      out.push('')
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

function checkLinks(filePath) {
  const problems = []
  const rawContent = fs.readFileSync(filePath, 'utf8')
  const content = stripCodeFences(rawContent)
  const dir = path.dirname(filePath)

  // match markdown links and images: [text](url) and ![alt](url)
  const regex = /!?\[[^\]]*\]\(([^)]+)\)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    // Heuristic: ignore code-like patterns such as getService()[method](params)
    const prevChar = match.index > 0 ? content[match.index - 1] : ''
    if (/[\w.]/.test(prevChar)) continue
    const raw = match[1].trim().replace(/^<|>$/g, '')
    if (!raw || raw.startsWith('#') || isExternal(raw)) continue
    // Skip mailto and hash-like
    if (/^(mailto:|tel:)/i.test(raw)) continue

    const targetRaw = normalizeTarget(raw)
    // Absolute paths from docs root or relative paths
    let resolved
    if (targetRaw.startsWith('/')) {
      // Treat as project-root absolute
      resolved = path.join(projectRoot, targetRaw)
    } else if (targetRaw.startsWith('./') || targetRaw.startsWith('../')) {
      resolved = path.resolve(dir, targetRaw)
    } else {
      // Likely relative to current file dir
      resolved = path.resolve(dir, targetRaw)
    }

    try {
      const exists = fs.existsSync(resolved)
      if (!exists) {
        problems.push({ href: raw, resolved })
      }
    } catch (_) {
      problems.push({ href: raw, resolved })
    }
  }
  return problems
}

function main() {
  if (!fs.existsSync(docsDir)) {
    console.error('Docs directory not found at', docsDir)
    process.exit(1)
  }

  const files = listMarkdownFiles(docsDir)
  let totalProblems = 0
  const report = []

  for (const file of files) {
    const issues = checkLinks(file)
    if (issues.length) {
      totalProblems += issues.length
      report.push({ file, issues })
    }
  }

  if (report.length === 0) {
    console.log('✅ No broken links found in docs')
    process.exit(0)
  }

  console.log('⚠️ Broken links found in docs:')
  for (const { file, issues } of report) {
    console.log(`\n- ${path.relative(projectRoot, file)} (${issues.length})`)
    for (const { href, resolved } of issues.slice(0, 20)) {
      console.log(`   • ${href} → ${path.relative(projectRoot, resolved)}`)
    }
    if (issues.length > 20) console.log(`   • ... and ${issues.length - 20} more`)
  }
  console.log(`\nTotal broken links: ${totalProblems}`)
  process.exit(1)
}

try {
  main()
} catch (err) {
  console.error('Link check failed:', err)
  process.exit(1)
}
