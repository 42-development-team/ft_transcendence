import CustomBtn from "../CustomBtn";

const Surrender = () => {
    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={() => {
                    console.log("Surrender"); //Handle surrend action => end of game
                }}
                disable={false}
                anim={true}
            >
                Surrender
            </CustomBtn>
        </div>
}

export default Surrender;