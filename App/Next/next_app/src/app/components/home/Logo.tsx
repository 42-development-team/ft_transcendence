
const Logo = ( { colorText, neonColor }: { colorText: string, neonColor: string}) => {
    return (
        <div
            className={`flex cyber pointer-events-none ` + colorText}
            style={{
                fontSize: '13vw',
                fontFamily: "Cy",
                textShadow: `0 0 35px black ,4px 4px 10px black, 0 0 15px ${neonColor}, 0 0 20px ${neonColor}, 0 0 25px ${neonColor}, 0 0 30px ${neonColor}`,
                userSelect: "none",
            }}>
            <span style={{ letterSpacing: '-3vw' }}>P</span>ONG
        </div>
    )
}

export default Logo;