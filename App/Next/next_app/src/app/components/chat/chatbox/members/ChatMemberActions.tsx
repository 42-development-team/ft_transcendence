'use client';
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import DropDownMenu from "@/app/components/dropdown/DropDownMenu";
import { clickOutsideHandler } from "@/app/hooks/clickOutsideHandler";
import { Tooltip } from "@material-tailwind/react";
import { useRef, useState } from "react";
import { useUserRole } from "./UserRoleProvider";
import { AlertErrorIcon } from "@/app/components/alert/AlertErrorIcon";
import { Alert } from "@material-tailwind/react";

type ChatMemberActionsProps = {
    isCurrentUser: boolean
    userId: string
    isMemberAdmin: boolean
    isMemberOwner: boolean
    isBanned?: boolean
    kickUser: () => void
    banUser: () => void
    unbanUser: () => void
    leaveChannel: () => void
}

// Todo: prevent double click on kick button
const ChatMemberActions = ({ userId, isCurrentUser, isMemberAdmin, isMemberOwner, isBanned, kickUser, banUser, unbanUser, leaveChannel }: ChatMemberActionsProps) => {
    const onProfileClick = () => {
        sessionStorage.setItem("userId", userId);
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }
    
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserRole();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [ openAlert, setOpenAlert ] = useState(false);

    const adminActionsEnabled: boolean = !isCurrentUser && !isMemberOwner && (isCurrentUserAdmin || isCurrentUserOwner);
    const ownerActionsEnabled: boolean = !isCurrentUser && isCurrentUserOwner && !isMemberAdmin;


    clickOutsideHandler({ ref: wrapperRef, handler: () => setIsOpen(false) });

    return (
        <div className="flex flex-row gap-2">
            {adminActionsEnabled && !isBanned &&
                <div ref={wrapperRef} className=" text-left w-full">
                    <Tooltip content="Mute" placement="top" className="tooltip">
                        <button onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex justify-center w-full rounded-2xl px-2 py-2 bg-base">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </Tooltip>
                    {isOpen && (
                        <div className="absolute z-10 mt-2 w-16 right-14 rounded-md bg-crust">
                            <DropDownAction onClick={() => console.log('Mute 30s!')}>30s</DropDownAction>
                            <DropDownAction onClick={() => console.log('Mute 60s')}>60s</DropDownAction>
                            <DropDownAction onClick={() => console.log('Mute 3m')}>3m</DropDownAction>
                            <DropDownAction onClick={() => console.log('Mute 10m')}>10m</DropDownAction>
                            <DropDownAction onClick={() => console.log('Mute 1h')}>1h</DropDownAction>
                        </div>
                    )}
                </div>
            }
            <DropDownMenu>
                <div aria-orientation="vertical" >
                    <DropDownAction onClick={onProfileClick}>View profile</DropDownAction>
                    <Alert
                        className="mb-4 mt-4 p-2 text-text border-mauve border-[1px] break-all"
                        variant='gradient'
                        open={openAlert}
                        icon={<AlertErrorIcon />}
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 100 },
                        }}>
                        {<p>User not found</p>}
                    </Alert>
                    {!isCurrentUser &&
                        <DropDownAction onClick={() => console.log('Play')}>Invite to play</DropDownAction>
                    }
                    {ownerActionsEnabled && !isBanned &&
                        <DropDownAction onClick={() => console.log('set as admin')}>Set as admin</DropDownAction>
                    }
                    {adminActionsEnabled && isBanned &&
                        <DropDownActionRed onClick={unbanUser}>Unban</DropDownActionRed>
                    }

                    {adminActionsEnabled && !isBanned &&
                        <>
                            <DropDownActionRed onClick={kickUser}>Kick</DropDownActionRed>
                            <DropDownActionRed onClick={banUser}>Ban</DropDownActionRed>
                        </>
                    }
                    {isCurrentUser &&
                        <DropDownActionRed onClick={leaveChannel}>Leave</DropDownActionRed>
                    }
                </div>
            </DropDownMenu>
        </div>
    )
}

export default ChatMemberActions;