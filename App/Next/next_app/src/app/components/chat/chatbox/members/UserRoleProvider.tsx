import { createContext, useContext } from 'react';

const UserRoleContext = createContext({
	isCurrentUserAdmin: false,
	isCurrentUserOwner: false
});

export const UserRoleProvider = (
	{ children, isCurrentUserAdmin, isCurrentUserOwner }:
		{ children: React.ReactNode, isCurrentUserAdmin: boolean, isCurrentUserOwner: boolean }) => {
	return (
		<UserRoleContext.Provider value={{ isCurrentUserAdmin, isCurrentUserOwner }}>
			{children}
		</UserRoleContext.Provider>
	)
}

export const useUserRole = () => {
	return useContext(UserRoleContext);
}