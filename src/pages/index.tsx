import UIPage from '@/components/UI'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>CleonCast</title>
        <meta name="description" content="CleonCast - foremost weather checks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cloudy.png" />
      </Head>
      <main>
        <UIPage/>
      </main>
    </>
  )
}
