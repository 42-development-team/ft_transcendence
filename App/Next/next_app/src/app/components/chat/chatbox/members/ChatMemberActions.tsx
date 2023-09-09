'use client';
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import DropDownMenu from "@/app/components/dropdown/DropDownMenu";
import { clickOutsideHandler } from "@/app/hooks/clickOutsideHandler";
import { Tooltip } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useUserRole } from "./UserRoleProvider";
import { AlertErrorIcon } from "@/app/components/alert/AlertErrorIcon";
import { Alert } from "@material-tailwind/react";
import { ChannelMember } from "@/app/utils/models";

type ChatMemberActionsProps = {
    isCurrentUser: boolean
    user: ChannelMember
    kickUser: () => void
    banUser: () => void
    unbanUser: () => void
    leaveChannel: () => void
    sendDirectMessage: () => void
    setAdmin: () => void
    unsetAdmin: () => void
    muteUser: (muteDuration: number) => void
    block: () => void
	addAsFriend: () =>void
    isBlocked: boolean
	isFriend: boolean
	isFriendAdded: boolean
}

const ChatMemberActions = (
    {
        isCurrentUser, user,
        kickUser, banUser, unbanUser,
        leaveChannel, sendDirectMessage, muteUser,
        setAdmin, unsetAdmin, block, isBlocked, addAsFriend, isFriend, isFriendAdded
    }: ChatMemberActionsProps) => {

    const onProfileClick = () => {
        sessionStorage.setItem("userId", user.id);
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }

    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserRole();
    const [ isOpen, setIsOpen ] = useState(false);
    const [ openAlert, setOpenAlert ] = useState(false);
    const [ lockSubmit, setLockSubmit ] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [ isMuted, setIsMuted ] = useState(Date.now() < Date.parse(user.mutedUntil));
    const adminActionsEnabled: boolean = !isCurrentUser && !user.isOwner && (isCurrentUserAdmin || isCurrentUserOwner);
    const ownerActionsEnabled: boolean = !isCurrentUser && isCurrentUserOwner && !user.isAdmin;
	const [actionClicked, setActionClicked] = useState(false);

    useEffect(() => {
        const currentlyMuted = user.isMuted && Date.now() < Date.parse(user.mutedUntil);
        setIsMuted(currentlyMuted);
    }, [user]);

    const handleAction = (action: () => void) => {
        if (lockSubmit) return;
        setLockSubmit(true);
        action();
        setIsOpen(false);
		setActionClicked(true);
        setTimeout(() => setLockSubmit(false), 1500);
    }

    clickOutsideHandler({ ref: wrapperRef, handler: () => setIsOpen(false) });

    return (
        <div className="flex flex-row gap-2">
            {adminActionsEnabled && !user.isBanned &&
                <div ref={wrapperRef} className=" text-left w-full">
                    <Tooltip content="Mute" placement="top" className="tooltip text-text">
                        <button onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex justify-center w-full rounded-2xl px-2 py-2 bg-base ${isMuted && " bg-crust"}`}>
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke={isMuted ? "#f9e2af" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </button>
                    </Tooltip>
                    {isOpen && (
                        <div className="absolute z-10 mt-2 w-24 right-14 rounded-md bg-crust">
                            {isMuted &&
                                <DropDownAction onClick={() => handleAction(() => muteUser(0))}>Unmute</DropDownAction>
                            }
                            <DropDownAction onClick={() => handleAction(() => muteUser(30))}>30s</DropDownAction>
                            <DropDownAction onClick={() => handleAction(() => muteUser(60))}>60s</DropDownAction>
                            <DropDownAction onClick={() => handleAction(() => muteUser(3 * 60))}>3m</DropDownAction>
                            <DropDownAction onClick={() => handleAction(() => muteUser(10 * 60))}>10m</DropDownAction>
                            <DropDownAction onClick={() => handleAction(() => muteUser(60 * 60))}>1h</DropDownAction>
                        </div>
                    )}
                </div>
            }
			{!actionClicked &&
				<DropDownMenu>
					<div aria-orientation="vertical" >
						<DropDownAction onClick={() => handleAction(onProfileClick)}>View profile</DropDownAction>
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
						<>
							<DropDownAction onClick={() => handleAction(sendDirectMessage)}>Direct message</DropDownAction>
							<DropDownAction onClick={() => handleAction(() =>console.log('Play'))}>Invite to play</DropDownAction>
							{!isBlocked &&
								<DropDownActionRed onClick={() => handleAction(block)}>Block</DropDownActionRed>
							}
						</>
						}
						{isCurrentUserOwner && user.isAdmin && !isCurrentUser &&
							<DropDownActionRed onClick={() => handleAction(unsetAdmin)}>Remove admin</DropDownActionRed>
						}
						{ownerActionsEnabled && !user.isBanned &&
							<DropDownAction onClick={() => handleAction(setAdmin)}>Set as admin</DropDownAction>
						}
						{adminActionsEnabled && user.isBanned &&
							<DropDownActionRed onClick={() => handleAction(unbanUser)}>Unban</DropDownActionRed>
						}
						{adminActionsEnabled && !user.isBanned &&
							<>
								<DropDownActionRed onClick={() => handleAction(kickUser)}>Kick</DropDownActionRed>
								<DropDownActionRed onClick={() => handleAction(banUser)}>Ban</DropDownActionRed>
							</>
						}
						{isCurrentUser &&
							<DropDownActionRed onClick={() => handleAction(leaveChannel)}>Leave</DropDownActionRed>
						}
						{!isCurrentUser && !isFriend && !isFriendAdded &&
							<DropDownActionRed onClick={() => handleAction(addAsFriend)}>Add as friend</DropDownActionRed>
						}
					</div>
				</DropDownMenu>
			}
        </div>
    )
}

export default ChatMemberActions;
