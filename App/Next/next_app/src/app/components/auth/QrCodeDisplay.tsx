import '../../globals.css'

const QrCodeDisplay = ({children, imageUrl="", displayBox=false} : {children: any, imageUrl: string, displayBox: Boolean}) => {
    return (
        <div>
            {imageUrl !== '' && displayBox &&
                <div className=" flex justify-center">
                    <img className=" rounded shadow-[0_30px_60px_-10px_rgba(0,0,0,0.05)] border-2 border-surface0"
                        placeholder={'none'}
                        src={imageUrl}
                        height="150"
                        width="150"
                        alt="QR Code"
                        {...children}
                    />
                </div>
            }
        </div>
    )
}

export default QrCodeDisplay;