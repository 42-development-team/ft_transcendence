import { createContext, useContext } from 'react';

// Create a context for the current user's role
const UserRoleContext = createContext({
  isCurrentUserAdmin: false,
  isCurrentUserOwner: false
});

// Use a Provider to pass the current user's role to the tree below.
export const UserRoleProvider = (
    {children, isCurrentUserAdmin, isCurrentUserOwner} : 
    {children: React.ReactNode, isCurrentUserAdmin: boolean, isCurrentUserOwner: boolean}) => {
  return (
    <UserRoleContext.Provider value={{isCurrentUserAdmin, isCurrentUserOwner}}>
      {children}
    </UserRoleContext.Provider>
  )
}

// Create a custom hook to use the user role context
export const useUserRole = () => {
  return useContext(UserRoleContext);
}