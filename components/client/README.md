# Client Components Directory

This directory is reserved for components that require client-side interactivity and must use the `"use client"` directive.

## Guidelines

- **Only place components here if they absolutely need client-side features** such as:
  - `useState`, `useEffect`, or other React hooks
  - Event handlers for user interactions
  - Browser APIs (localStorage, etc.)
  - Third-party libraries that require client-side rendering

- **Prefer server components whenever possible** for:
  - Static content rendering
  - Data fetching and display
  - SEO-critical content
  - Form submissions (use Server Actions instead)

## Examples of appropriate client components:

- Interactive maps
- Complex form validation with real-time feedback
- Modal dialogs with state management
- Third-party widgets that require browser APIs
- Components using browser-only libraries

## Migration from server to client:

If you need to convert a server component to a client component:

1. Move the component to this directory
2. Add `"use client"` at the top of the file
3. Update imports in parent components
4. Ensure the component doesn't break SSR expectations

## Guard Script

The build process includes a guard script that enforces this structure:
- ✅ `"use client"` is allowed only in `components/client/`
- ❌ `"use client"` anywhere else will fail the build

This ensures we maintain server-first architecture for optimal SEO performance.