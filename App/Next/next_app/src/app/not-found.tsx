import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl'>404 - Page Not Found</h1>
            <Link className='bg-mauve hover:bg-pink cursor-pointer drop-shadow-xl rounded text-base font-bold text-lg p-2 text-center
		disabled:pointer-events-none disabled:opacity-50' href="/">
            Return home</Link>
        </div>
    )
}