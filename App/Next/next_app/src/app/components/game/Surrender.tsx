"use client";

import CustomBtn from "../CustomBtn";
import useGame from "@/app/hooks/useGame";
import { useAuthContext } from "@/app/context/AuthContext";

const Surrender = () => {
    const {surrender, data} = useGame();
    const {userId} = useAuthContext();
    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={async () => {
                    console.log("Surrender"); //Handle surrend action => end of game
                    if (data)
                        await surrender(data.id, parseInt(userId));
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