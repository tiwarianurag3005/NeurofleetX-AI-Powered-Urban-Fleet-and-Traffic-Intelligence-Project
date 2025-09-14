import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children, value }) => (
    <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export default DataContext;