import './globals.css';
import Head from 'next/head';
import { FaBeer, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Head>
        <title>Transcendence</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className='bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl'>
          <div className='w-3/5 p-5'>
            <div className='text-left font-bold'>
              <span className='text-green-500'>Pong</span>Transcendence
            </div>
            <div className='py-10'>
              <h2 className='text-3xl font-bold text-green-500 mb-2'>
                Easy sign in
              </h2>
              <div className='boder-2 w-10 borer-green-500 inline-block mb-2'></div>
              <div className='flex justify-center my-2 mb-5'>
                <a href='' className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                  <FaBeer className='text-sm' />
                </a>
                <a href='' className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                  <FaBeer className='text-sm' />
                </a>
                <a href='' className='border-2 border-gray-200 rounded-full p-3 mx-1'>
                  <FaBeer className='text-sm' />
                </a>
              </div>
              <div className='flex flex-col items-center'>
                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3'>
                  <FaRegEnvelope className='text-gray-400 mr-2'/>
                  <input type='email' name='email' placeholder='Email' className='bg-gray-100 outline-none text-sm flex-1'/>
                </div>
                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3'>
                  <MdLockOutline className='text-gray-400 mr-2'/>
                  <input type='password' name='password' placeholder='Password' className='bg-gray-100 outline-none text-sm flex-1'/>
                </div>
                <div className='flex justify-between w-64 mb-5'>
                  <label className='flex items-center text-xs'><input type='checkbox' name='remember' className='mr-1'/>Remember me</label>
                  <a href='' className='text-xs'>Forgot password?</a>
                </div>
                <a href='' className='border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-red-500'>Sign in</a>
              </div>
            </div>
          </div>
          <div className='w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
            <h2 className='text-3xl font-bold mb-2'>Do you want to play PONG ?</h2>
            <div className='border-2 w-10 border-white inline-block mb-2'></div>
            <p className='mb-8'>Insert your 42 login and choose a f*****g password</p>
            <a href='' className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-red-500'>Sign up</a>
          </div>
        </div>
      </main>
    </div>
  )
}

// import Image from 'next/image'
// import styles from './page.module.css'

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <p>
//           Get started by editing&nbsp;
//           <code className={styles.code}>src/app/page.tsx</code>
//         </p>
//         <div>
//           <a
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className={styles.vercelLogo}
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className={styles.center}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className={styles.grid}>
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Docs <span>-&gt;</span>
//           </h2>
//           <p>Find in-depth information about Next.js features and API.</p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Learn <span>-&gt;</span>
//           </h2>
//           <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Templates <span>-&gt;</span>
//           </h2>
//           <p>Explore the Next.js 13 playground.</p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className={styles.card}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2>
//             Deploy <span>-&gt;</span>
//           </h2>
//           <p>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   )
// }
