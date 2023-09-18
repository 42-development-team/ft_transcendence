"use client";

import { useEffect } from "react";
import CustomBtn from "../CustomBtn";
import { useAuthContext } from "@/app/context/AuthContext";

const Surrender = ( {...props} ) => {
    const {userId} = useAuthContext();
    const {socket, data, surrender} = props;

    return (
        <div className="flex justify-center">
            <CustomBtn
                id="Surrender"
                onClick={async () => {
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