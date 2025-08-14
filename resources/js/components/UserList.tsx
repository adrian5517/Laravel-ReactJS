import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';

interface User {
    id: number;
    full_name: string;
    email: string;
    created_at: string;
}

interface RoleGroup {
    role: string;
    users: User[];
}

interface UserListProps {
    refresh: boolean;
    onRefresh: () => void;
}

const UserList: FC<UserListProps> = ({ refresh, onRefresh }) => {
    const [usersByRole, setUsersByRole] = useState<RoleGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (refresh) {
            fetchUsers();
            onRefresh(); // Reset the refresh flag
        }
    }, [refresh, onRefresh]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/v1/users');
            
            if (response.data.success) {
                setUsersByRole(response.data.data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            setError(error.response?.data?.message || 'An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                    onClick={handleRefresh}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const totalUsers = usersByRole.reduce((total, roleGroup) => total + roleGroup.users.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Users by Role ({totalUsers} total)
                </h2>
                <button
                    onClick={handleRefresh}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Refresh
                </button>
            </div>

            {usersByRole.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        No users found. Create your first user!
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {usersByRole.map((roleGroup) => (
                        <div key={roleGroup.role} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {roleGroup.role} ({roleGroup.users.length} users)
                                </h3>
                            </div>
                            
                            {roleGroup.users.length === 0 ? (
                                <div className="px-6 py-4 text-gray-500 text-center">
                                    No users with this role yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Full Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {roleGroup.users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {user.full_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(user.created_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;
