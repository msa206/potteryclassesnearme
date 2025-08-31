import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to the pottery classes hub
  redirect('/pottery-classes')
}