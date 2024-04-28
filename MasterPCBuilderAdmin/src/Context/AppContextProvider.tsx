import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { UserType } from "../Type/User";



export interface AppContextType {
    user: UserType,
    setUser: Dispatch<SetStateAction<UserType>>;
    token: string,
    setToken: Dispatch<SetStateAction<string>>;
    isLoged: boolean,
    setIsLoged: Dispatch<SetStateAction<boolean>>;
}
export const AppContext = createContext<AppContextType>({} as AppContextType);
const AppContextProvider = (props: any) => {
    const [user, setUser] = useState<UserType>({} as UserType)
    const [token, setToken] = useState<string>("")
    const [isLoged, setIsLoged] = useState(false)
    const contextValues: AppContextType = {
        user: user,
        setUser: setUser,
        token: token,
        setToken: setToken,
        isLoged: isLoged,
        setIsLoged: setIsLoged
    };
    return (
        <AppContext.Provider value={contextValues}>
            {props.children}
        </AppContext.Provider>
    );
};
export const useAppContext = () => {

    return useContext(AppContext);
}

export default AppContextProvider
