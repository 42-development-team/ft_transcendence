"use client";

import CustomBtn from "../CustomBtn";
import { useAuthContext } from "@/app/context/AuthContext";

const Surrender = ( {...props} ) => {
    const {userId} = useAuthContext();
    const {data, surrender} = props;

    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={async () => {
                    console.log("Surrend data: ", data)
                    if (data)
                        surrender(data.id, parseInt(userId));
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