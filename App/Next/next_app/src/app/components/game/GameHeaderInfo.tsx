"use client";

import { DropDownActionSurrender } from "../dropdown/DropDownItem";
import DropDownMenu from "../dropdown/DropDownMenu";

export function GameHeaderInfo({ userName, userId, opponnentUsername, currUserIsOnLeft }: { userName: string, userId: string, opponnentUsername: string, currUserIsOnLeft: boolean }, props: any) {
    return (
        <>
            {currUserIsOnLeft ? (
                <>
                    <div className="flex flex-row text-[2.2vw] text-white">
                        {userName}
                        <DropDownMenu width="w-4" height="h-4" color="bg-crust" position="bottom-10 right-2">
                            <DropDownActionSurrender onClick={() => props.surrender(props.data.id, parseInt(userId))}>
                                Surrender
                            </DropDownActionSurrender>
                        </DropDownMenu>
                    </div>
                    <div className="flex text-[2.2vw] text-white">{opponnentUsername}</div>

                </>
            ) : (
                <>
                    <div className="flex text-[2.2vw] text-white">{opponnentUsername}</div>
                    <div className="flex flex-row text-[2.2vw] text-white">
                        {userName}
                        <DropDownMenu width="w-4" height="h-4" color="bg-crust" position="bottom-10 right-2">
                            <DropDownActionSurrender onClick={() => props.surrender(props.data.id, parseInt(userId))}>
                                Surrender
                            </DropDownActionSurrender>
                        </DropDownMenu>
                    </div>

                </>
            )}

        </>
    )
}