import { useAuthContext } from "@/app/context/AuthContext";
import CustomBtn from "../CustomBtn";

const Surrender = () => {
    const {socket} = useAuthContext();
    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={() => {
                    console.log("Surrender"); //Handle surrend action => end of game
                    socket?.emit("surrender");
                }}
                disable={false}
                anim={true}
            >
                Surrender
            </CustomBtn>
        </div>
    );
}

export default Surrender;