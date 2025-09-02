import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

let bad = false
const allowedClientDirs = [
  'components/client',
]

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
        const relativePath = relative(process.cwd(), fp)
        
        // Check if the file is in an allowed client directory
        const isInAllowedDir = allowedClientDirs.some(allowedDir => 
          relativePath.startsWith(allowedDir)
        )
        
        if (isInAllowedDir) {
          console.log(`✅ Allowed "use client" in ${relativePath}`)
        } else {
          console.error(`❌ Found "use client" in ${relativePath}`)
          console.error(`   Client components must be in: ${allowedClientDirs.join(', ')}`)
          bad = true
        }
      }
    }
  }
}

console.log('🔍 Checking for "use client" directives...')
console.log(`📁 Allowed client directories: ${allowedClientDirs.join(', ')}`)
walk(process.cwd())

if (bad) {
  console.error('\n❌ Build failed: "use client" directives found in disallowed locations!')
  console.error('Move client components to allowed directories or convert to server components.')
  process.exit(1)
} else {
  console.log('✅ All "use client" directives are in allowed locations - build can proceed!')
}