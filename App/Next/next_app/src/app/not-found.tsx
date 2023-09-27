"use client";

import notFoundHigh from '../../public/notFoundHigh.png';
import { useRouter } from "next/navigation";
import CustomBtn from './components/CustomBtn';

export default function NotFound() {
    const router = useRouter();

    const onClick = () => {
        router.push('/home');
    }

    return (
        <div className='flex flex-col items-center '>
            <div style={{
                backgroundImage: 'url(' + notFoundHigh.src + ')',
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
                border: 'solid 0px',
                borderRadius: 400 / 2 + 'px',
                height: 400 + 'px',
                width: 400 + 'px',
            }} />
            <h1 className='text-center text-3xl mb-6'>404 - Page not found</h1>
            <CustomBtn disable={false} onClick={onClick} color='bg-red'>Home</CustomBtn>
        </div>
    )
}