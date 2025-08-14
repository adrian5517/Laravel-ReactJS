import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';

interface Role {
    id: number;
    name: string;
    description: string;
}

interface ValidationErrors {
    [key: string]: string[] | undefined;
}

interface UserFormProps {
    onUserCreated: () => void;
}

const UserForm: FC<UserFormProps> = ({ onUserCreated }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        roles: [] as number[]
    });
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/api/v1/roles');
            if (response.data.success) {
                setRoles(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev: ValidationErrors) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleRoleChange = (roleId: number) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(roleId)
                ? prev.roles.filter(id => id !== roleId)
                : [...prev.roles, roleId]
        }));
        // Clear role error when user selects a role
        if (errors.roles) {
            setErrors((prev: ValidationErrors) => ({
                ...prev,
                roles: undefined
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus('loading');
        setErrors({});

        try {
            const response = await axios.post('/api/v1/users', formData);
            
            if (response.data.success) {
                setSubmitStatus('success');
                setFormData({
                    full_name: '',
                    email: '',
                    roles: []
                });
                
                // Redirect to user list after 1.5 seconds
                setTimeout(() => {
                    onUserCreated();
                }, 1500);
            }
        } catch (error: any) {
            setSubmitStatus('error');
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['An error occurred while creating the user.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New User</h2>
            
            {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    User created successfully! Redirecting to user list...
                </div>
            )}

            {errors.general && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.full_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                        required
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name[0]}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                        required
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roles * (Select at least one)
                    </label>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.roles.includes(role.id)}
                                    onChange={() => handleRoleChange(role.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {role.name}
                                    {role.description && (
                                        <span className="text-gray-500"> - {role.description}</span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.roles && (
                        <p className="mt-1 text-sm text-red-600">{errors.roles[0]}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || submitStatus === 'success'}
                    className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        loading || submitStatus === 'success'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    } text-white`}
                >
                    {loading ? 'Creating User...' : submitStatus === 'success' ? 'User Created!' : 'Create User'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
