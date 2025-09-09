# Blog Authoring Guide

This guide explains how to create and manage blog posts for the Pottery Classes Near Me website.

## Quick Reference

- **Blog URL**: `https://localpotteryclasses.com/blog`
- **Content Directory**: `content/blog/`
- **Images Directory**: `public/images/` or `public/blog/[slug]/`
- **Default Social Image**: `/localpotteryclasses_socialimage.png`
- **Logo**: `/android-chrome-512x512.png`

## Quick Start

1. Create a new `.mdx` file in the `content/blog/` directory
2. Add the required frontmatter (metadata) at the top
3. Write your content using Markdown
4. Update sitemap.ts with your post date
5. The post will automatically appear on the blog after build

## File Structure

```
content/
└── blog/
    ├── your-post-slug.mdx
    ├── another-post.mdx
    └── ...
```

## Required Frontmatter

Every blog post MUST include these fields in the frontmatter:

```yaml
---
title: Your Blog Post Title
date: '2025-09-15'  # ISO format: YYYY-MM-DD (use quotes)
excerpt: A brief description of your post (150-200 characters)
slug: your-post-slug  # URL-friendly version, must match filename
---
```

## Optional Frontmatter

You can also include these optional fields:

```yaml
---
author: Author Name  # Defaults to "Pottery Classes Directory"
coverImage: /images/your-post-cover.jpg  # Main article image
ogImage: /images/your-post-social.jpg  # Social media preview image (1200x630 recommended)
updated: '2025-09-20'  # If you update the post later
draft: true  # Set to true to hide the post (default: false)
---
```

**Note**: If no images are specified, the default social image (`/localpotteryclasses_socialimage.png`) will be used.

## Complete Example

Create a file called `content/blog/pottery-wheel-maintenance.mdx`:

```mdx
---
title: Essential Pottery Wheel Maintenance Tips
date: '2025-09-15'
excerpt: Keep your pottery wheel running smoothly with these maintenance tips for beginners and experienced potters.
slug: pottery-wheel-maintenance
author: Jane Potter
coverImage: /images/pottery-wheel-maintenance-cover.jpg
ogImage: /images/pottery-wheel-maintenance-social.jpg
draft: false
---

# Essential Pottery Wheel Maintenance Tips

Your content goes here. You can use standard Markdown formatting...

## Subheadings Work Great

You can include:
- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

### Code Blocks

```javascript
// Code examples if needed
const pottery = "awesome";
```

## Images

![Alt text for image](/blog/pottery-wheel-maintenance/wheel-parts.jpg)

And much more...
```

## Adding Images

### Option 1: Shared Images Directory (Recommended)
Place images in the `public/images/` directory:

```
public/
└── images/
    ├── raku-pottery-cover.jpg
    ├── raku-pottery-social.jpg
    └── other-images.jpg
```

Reference in frontmatter:
```yaml
coverImage: /images/raku-pottery-cover.jpg
ogImage: /images/raku-pottery-social.jpg
```

### Option 2: Blog-Specific Folders
Create folders in `public/blog/` for organization:

```
public/
└── blog/
    └── your-post-slug/
        ├── cover.jpg
        ├── og.jpg
        └── content-image.jpg
```

### In-Content Images
Reference images in your MDX content:
```markdown
![Description](/images/pottery-wheel.jpg)
```

### Image Guidelines
- **Cover Image**: Ideally 1920x1080 or similar aspect ratio
- **Social/OG Image**: 1200x630 pixels (Facebook/Twitter standard)
- **Content Images**: Optimize for web (under 500KB per image)
- **Default Fallback**: `/localpotteryclasses_socialimage.png` is used if no image specified

## Writing Tips

### SEO Best Practices

- **Title**: Keep under 60 characters for best SEO
- **Excerpt**: Make it compelling - this shows in search results
- **Content Length**: Aim for 1000+ words for better SEO
- **Headings**: Use proper hierarchy (H1 → H2 → H3)
- **Keywords**: Include relevant pottery/ceramics keywords naturally

### Content Guidelines

1. **Be Helpful**: Focus on providing value to readers
2. **Be Specific**: Include concrete examples and tips
3. **Be Visual**: Add images to break up text
4. **Be Scannable**: Use headings, lists, and short paragraphs
5. **Be Authentic**: Write in a conversational, approachable tone

### Recommended Topics

- Pottery techniques and tutorials
- Studio reviews and recommendations
- Equipment guides and reviews
- Student success stories
- Pottery history and culture
- Local pottery events and exhibitions
- Beginner tips and FAQs
- Advanced techniques and challenges

## Markdown Features

The blog supports GitHub Flavored Markdown (GFM):

### Tables

```markdown
| Technique | Difficulty | Time |
|-----------|------------|------|
| Pinch Pot | Easy | 1 hour |
| Coil Building | Medium | 2 hours |
| Wheel Throwing | Hard | 3+ hours |
```

### Task Lists

```markdown
- [x] Prepare clay
- [x] Center on wheel
- [ ] Shape the vessel
- [ ] Trim the base
```

### Blockquotes

```markdown
> "The potter's wheel is not just a tool, it's a teacher."
```

## Draft Posts

To work on a post without publishing it:

```yaml
---
draft: true  # This hides the post
---
```

Draft posts:
- Won't appear in the blog listing
- Won't be included in the sitemap
- Won't be built as static pages
- Are perfect for work-in-progress content

## Publishing Workflow

1. **Create**: Write your post in `content/blog/`
2. **Preview**: Run `npm run dev` to see it locally
3. **Review**: Check formatting, images, and links
4. **Publish**: Set `draft: false` (or remove the field)
5. **Update Sitemap**: Add your post to `app/sitemap.ts`:
   ```typescript
   // In PAGE_SPECIFIC_DATES section:
   'blog/your-post-slug': new Date('2025-09-15'),
   ```
6. **Build**: Run `npm run build` to generate static pages
7. **Deploy**: Push to production

## Common Issues

### Post Not Showing Up?

- Check that `draft` is not set to `true`
- Ensure the filename ends with `.mdx`
- Verify all required frontmatter fields are present
- Make sure the `slug` matches the filename

### Images Not Loading?

- Verify the image path starts with `/blog/`
- Check that images are in the `public` folder
- Use lowercase filenames with no spaces

### Build Errors?

- Validate your frontmatter YAML syntax
- Check for unclosed MDX tags
- Ensure dates are in ISO format ('YYYY-MM-DD')

## Special Blog Features

### Automatic Features
Every blog post automatically includes:

1. **Breadcrumb Navigation**: Home / Blog / Your Post Title
2. **SEO Structured Data**:
   - BlogPosting schema for rich snippets
   - BreadcrumbList schema for navigation
   - Automatic canonical URLs
3. **Popular Cities Section**: Links to pottery classes in major cities
4. **Back to Blog Link**: Footer navigation
5. **Author & Date Display**: Formatted metadata display

### FAQ Sections
For posts like the Raku pottery article, FAQ sections are automatically added with:
- Collapsible question/answer format
- FAQPage structured data for SEO
- Styled with pottery-themed colors

To add FAQs to your post, include them in the content or as a special section.

## Advanced Features

### Custom Components

You can import and use React components in MDX:

```mdx
import CustomGallery from '@/components/CustomGallery'

<CustomGallery images={[...]} />
```

### Syntax Highlighting

Code blocks automatically get syntax highlighting. Specify the language:

````markdown
```python
def make_pottery():
    return "beautiful ceramics"
```
````

### SEO Optimization
Each blog post generates:
- Meta tags (title, description, author)
- Open Graph tags for social sharing
- Twitter Card metadata
- JSON-LD structured data for search engines
- Canonical URLs to prevent duplicate content

## Need Help?

- Check existing posts in `content/blog/` for examples
- Test your posts locally with `npm run dev`
- Keep the content pottery-focused and helpful
- Remember: No client-side JavaScript needed - everything renders on the server!