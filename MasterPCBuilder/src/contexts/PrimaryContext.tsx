import { View, Text } from 'react-native'
import React, { useContext, useState, createContext } from 'react'
import IUserType from '../interfaces/IUserType';

export interface PrimaryContextType {
    user: IUserType;
    setUser: React.Dispatch<React.SetStateAction<IUserType>>;
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PrimaryContext = createContext<PrimaryContextType>({} as PrimaryContextType);

const PrimaryContextProvider = (props: any) => {
    const [user, setUser] = useState({} as IUserType);
    const [darkMode, setDarkMode] = useState(true);
    const contextValues: PrimaryContextType = {
        user,
        setUser,
        darkMode,
        setDarkMode
    };

    return (
        <PrimaryContext.Provider value={contextValues}>
            {props.children}
        </PrimaryContext.Provider>
    )
}

export const usePrimaryContext = () => {
    return useContext(PrimaryContext);
}

export default PrimaryContextProvider