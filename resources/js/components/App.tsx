import React, { useState, FC } from 'react';
import UserForm from './UserForm.tsx';
import UserList from './UserList.tsx';

const App: FC = () => {
    const [currentView, setCurrentView] = useState<'form' | 'list'>('form');
    const [refreshUsers, setRefreshUsers] = useState<boolean>(false);

    const handleUserCreated = () => {
        setRefreshUsers(true);
        setCurrentView('list');
    };

    const triggerRefresh = () => {
        setRefreshUsers(!refreshUsers);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        User Management System
                    </h1>
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setCurrentView('form')}
                            className={`px-4 py-2 rounded-md font-medium ${
                                currentView === 'form'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Add User
                        </button>
                        <button
                            onClick={() => setCurrentView('list')}
                            className={`px-4 py-2 rounded-md font-medium ${
                                currentView === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            View Users
                        </button>
                    </nav>
                </header>

                <main>
                    {currentView === 'form' && (
                        <UserForm onUserCreated={handleUserCreated} />
                    )}
                    {currentView === 'list' && (
                        <UserList 
                            refresh={refreshUsers} 
                            onRefresh={triggerRefresh}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
