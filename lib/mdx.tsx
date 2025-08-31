import fs from 'fs/promises'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

const contentDir = path.join(process.cwd(), 'content')

export async function readCityIntroMdx(citySlug: string) {
  try {
    const filePath = path.join(contentDir, 'cities', `${citySlug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    const { content } = await compileMDX({
      source: fileContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      },
    })
    
    return content
  } catch {
    // Return default content if MDX file doesn't exist
    return (
      <div className="prose prose-slate">
        <p>
          Discover the best pottery classes in this vibrant city. Whether you&apos;re a beginner 
          looking to try wheel throwing for the first time or an experienced potter seeking 
          to refine your glazing techniques, our comprehensive directory helps you find the 
          perfect studio. From hand-building workshops to advanced ceramics courses, explore 
          local pottery studios that match your skill level and artistic goals.
        </p>
      </div>
    )
  }
}

export async function readCityFaqMdx(citySlug: string) {
  try {
    const filePath = path.join(contentDir, 'faqs', `${citySlug}.mdx`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    const { content } = await compileMDX({
      source: fileContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      },
    })
    
    return content
  } catch {
    // Return default FAQ if MDX file doesn't exist
    return (
      <div className="prose prose-slate">
        <h3>What should I expect in my first pottery class?</h3>
        <p>
          Most beginner pottery classes start with an introduction to clay basics and studio 
          safety. You&apos;ll learn fundamental techniques like centering clay on the wheel, basic 
          hand-building methods, and glazing processes. Studios typically provide all materials 
          and tools for your first class.
        </p>
        
        <h3>How much do pottery classes typically cost?</h3>
        <p>
          Pottery class prices vary depending on the format and duration. Drop-in classes 
          range from $40-80 per session, while multi-week courses typically cost $200-400. 
          Most studios include clay and basic glazes in the price, though firing fees may 
          be additional.
        </p>
        
        <h3>Do I need prior experience to join a pottery class?</h3>
        <p>
          No prior experience is necessary for beginner classes. Most studios offer courses 
          specifically designed for complete beginners, with patient instructors who guide 
          you through each step of the pottery-making process.
        </p>
        
        <h3>What should I wear to a pottery class?</h3>
        <p>
          Wear comfortable clothes that you don&apos;t mind getting dirty. Clay can be messy, 
          so avoid wearing your favorite outfit. Closed-toe shoes are recommended for safety. 
          Most studios provide aprons, but bringing your own is always a good idea.
        </p>
      </div>
    )
  }
}