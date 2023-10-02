
export function CustomImage( {url="https://img.freepik.com/free-icon/user_318-563642.jpg", size=32} : {url?: string, size?: number}) {

    return (
        <div style={{
            backgroundImage: 'url(' + url + ')',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            border: 'solid 0px',
            borderRadius: size / 2 + 'px',
            height: size + 'px',
            width: size + 'px',
        }} />
    )
}
