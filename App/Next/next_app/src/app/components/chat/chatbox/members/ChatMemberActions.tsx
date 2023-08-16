import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import DropDownMenu from "@/app/components/dropdown/DropDownMenu";
import { useEffect } from "react";
import { useUserRole } from "./UserRoleProvider";

type ChatMemberActionsProps = {
    isCurrentUser: boolean
    isMemberAdmin: boolean
    isMemberOwner: boolean
}

const ChatMemberActions = ({ isCurrentUser, isMemberAdmin, isMemberOwner }: ChatMemberActionsProps) => {
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserRole();
    
    return (
        <DropDownMenu>
            <div aria-orientation="vertical" >
                <DropDownAction onClick={() => console.log('View Profile')}>
                    View profile
                </DropDownAction>
                {!isCurrentUser &&
                    <DropDownAction onClick={() => console.log('Play')}>
                        Invite to play
                    </DropDownAction>
                }
                {!isCurrentUser && isCurrentUserOwner && !isMemberAdmin &&
                    <DropDownAction onClick={() => console.log('set as admin')}>
                        Set as admin
                    </DropDownAction>
                }
                {!isCurrentUser && !isMemberOwner && (isCurrentUserAdmin || isCurrentUserOwner) &&
                    <>
                        <DropDownAction onClick={() => console.log('Kick')}>
                            Kick
                        </DropDownAction>
                        <DropDownAction onClick={() => console.log('Mute')}>
                            Mute
                        </DropDownAction>
                        <DropDownActionRed onClick={() => console.log('Ban')}>
                            Ban
                        </DropDownActionRed>
                    </>
                }
                {isCurrentUser &&
                    <DropDownActionRed onClick={() => console.log('Leave Channel')}>
                        Leave
                    </DropDownActionRed>
                }
            </div>
        </DropDownMenu>
    )
}

export default ChatMemberActions;