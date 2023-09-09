import Link from 'next/link';
import notFoundHigh from '../../public/notFoundHigh.png';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className='flex flex-col gap-4'>
            <Image src={notFoundHigh} alt='404' width={500} height={500} className=' flex transition-transform translate-y-15'/>
            <h1 className='text-center text-2xl mb-6'>404 - Page Not Found</h1>
            <Link className='mb-10 bg-mauve hover:bg-pink cursor-pointer drop-shadow-xl rounded text-base font-bold text-lg p-2 text-center
		disabled:pointer-events-none disabled:opacity-50' href="/">
            Return home</Link>
        </div>
    )
}