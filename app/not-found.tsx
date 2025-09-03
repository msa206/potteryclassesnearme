import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Pottery Classes Near Me',
  description: 'The page you are looking for could not be found. Browse our pottery classes directory to find ceramic studios near you.',
  robots: 'noindex, follow',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-porcelain to-white">
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="text-center">
          {/* Large 404 visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 mx-auto bg-clay/10 rounded-full mb-6">
              <svg className="w-16 h-16 text-clay" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-ink mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-4">
              Oops! This page doesn&apos;t exist
            </h2>
          </div>

          <p className="text-lg text-ink/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you&apos;re looking for might have been moved, deleted, or doesn&apos;t exist. 
            Don&apos;t worry though - you can still find amazing pottery classes near you!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal text-white rounded-xl hover:bg-clay transition-colors font-semibold text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            
            <Link
              href="/pottery-classes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal border-2 border-teal rounded-xl hover:bg-teal hover:text-white transition-colors font-semibold text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Classes
            </Link>
          </div>

          {/* Popular destinations */}
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-ink mb-6">
              Popular Pottery Classes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-ink mb-3">Major Cities</h4>
                <div className="space-y-2">
                  <Link
                    href="/pottery-classes/ny/new-york"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    New York, NY
                  </Link>
                  <Link
                    href="/pottery-classes/ca/los-angeles"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Los Angeles, CA
                  </Link>
                  <Link
                    href="/pottery-classes/il/chicago"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Chicago, IL
                  </Link>
                  <Link
                    href="/pottery-classes/tx/houston"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Houston, TX
                  </Link>
                  <Link
                    href="/pottery-classes/az/phoenix"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Phoenix, AZ
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-ink mb-3">By State</h4>
                <div className="space-y-2">
                  <Link
                    href="/pottery-classes/california"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    California
                  </Link>
                  <Link
                    href="/pottery-classes/new-york"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    New York
                  </Link>
                  <Link
                    href="/pottery-classes/texas"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Texas
                  </Link>
                  <Link
                    href="/pottery-classes/florida"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Florida
                  </Link>
                  <Link
                    href="/pottery-classes/washington"
                    className="block text-teal hover:text-clay transition-colors"
                  >
                    Washington
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-sand/20">
              <Link
                href="/pottery-classes"
                className="text-teal hover:text-clay transition-colors font-medium"
              >
                View all states and cities →
              </Link>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-12 text-center">
            <p className="text-ink/60 mb-4">
              Still can&apos;t find what you&apos;re looking for?
            </p>
            <Link
              href="/search"
              className="text-teal hover:text-clay transition-colors font-medium"
            >
              Try our search page
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}