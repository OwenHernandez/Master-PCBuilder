import { View, Text } from 'react-native'
import React, { useContext, useState, createContext } from 'react'

export interface PrimaryContextType {
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
}

export const PrimaryContext = createContext<PrimaryContextType>({} as PrimaryContextType);

const PrimaryContextProvider = (props: any) => {
    const [user, setUser] = useState("");
    const contextValues: PrimaryContextType = {
        user,
        setUser
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