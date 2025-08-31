import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

let bad = false
const walk = (p: string) => {
  for (const f of readdirSync(p)) {
    const fp = join(p, f)
    const s = statSync(fp)
    
    // Skip node_modules and .next directories
    if (f === 'node_modules' || f === '.next' || f === '.git') {
      continue
    }
    
    if (s.isDirectory()) {
      walk(fp)
    } else if (/\.(tsx?|jsx?|mdx)$/.test(f)) {
      const txt = readFileSync(fp, 'utf8')
      if (/^[ \t]*["']use client["'];?/m.test(txt)) {
        console.error(`❌ Found "use client" in ${fp}`)
        bad = true
      }
    }
  }
}

console.log('🔍 Checking for "use client" directives...')
walk(process.cwd())

if (bad) {
  console.error('\n❌ Build failed: "use client" directives found!')
  console.error('This project must be server-only for SEO optimization.')
  process.exit(1)
} else {
  console.log('✅ No "use client" directives found - build can proceed!')
}