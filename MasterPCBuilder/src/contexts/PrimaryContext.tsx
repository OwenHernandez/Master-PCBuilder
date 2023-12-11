import { View, Text } from 'react-native'
import React, { useContext, useState, createContext } from 'react'
import IUserType from '../interfaces/IUserType';

export interface PrimaryContextType {
    user: IUserType;
    setUser: React.Dispatch<React.SetStateAction<IUserType>>;
}

export const PrimaryContext = createContext<PrimaryContextType>({} as PrimaryContextType);

const PrimaryContextProvider = (props: any) => {
    const [user, setUser] = useState({} as IUserType);
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