"use client";
import '../../globals.css'

const QrCodeDisplay = ({children, imageUrl="", displayBox=false} : {children: any, imageUrl: string, displayBox: Boolean}) => {
    return (
        imageUrl !== '' &&  displayBox && 
        <div className=" flex justify-center">
            <img className=" rounded shadow-[0_30px_60px_-10px_rgba(0,0,0,0.69)] border-2 border-surface0" 
            placeholder={'/home/aurel/Documents/ft_transcendence/App/Next/next_app/public/logout-svgrepo-com.svg'} //TODO: add placeHolder accordingly
            src={imageUrl} 
            height="150" 
            width="150" 
            alt="QR Code" 
            {...children}
            />
        </div> 
    )
}

export default QrCodeDisplay;