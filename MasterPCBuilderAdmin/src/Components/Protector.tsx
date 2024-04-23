import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectorProps {
    isLoged: boolean;
    children: React.ReactNode;
}

const Protector: React.FC<ProtectorProps> = ({ isLoged, children }) => {
    if (!isLoged) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export default Protector;
