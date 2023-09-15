import CustomBtn from "../CustomBtn";
import useGame from "@/app/hooks/useGame";
import { useAuthContext } from "@/app/context/AuthContext";

const Surrender = () => {
    const {surrender} = useGame();
    const {userId} = useAuthContext();
    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={() => {
                    console.log("Surrender"); //Handle surrend action => end of game
                    surrender(parseInt(userId));
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