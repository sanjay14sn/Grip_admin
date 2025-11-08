import React, { useEffect, useState } from 'react';
import roleApiProvider from '../apiProvider/roleApi';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const RoleNewAccessLayer = () => {
    const [permissions, setPermissions] = useState({});
    const [roleName, setRoleName] = useState('');
    const [roleNameError, setRoleNameError] = useState('');
    const [permissionError, setPermissionError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [permissionOptions, setPermissionOptions] = useState([]);
    const [featureLabels, setFeatureLabels] = useState({});
    const [availableActions, setAvailableActions] = useState([]);
    const [permissionsInitialized, setPermissionsInitialized] = useState(false);

    // Initialize permissions structure based on permissionOptions
    const initializePermissions = (rolePermissions = []) => {
        const initialPermissions = {};

        permissionOptions.forEach(permission => {
            if (!initialPermissions[permission.category]) {
                initialPermissions[permission.category] = {};
            }

            // Check if this permission exists in the role's permissions (for edit mode)
            const hasPermission = rolePermissions.some(p => p._id === permission._id);
            initialPermissions[permission.category][permission.type] = hasPermission;
        });

        return initialPermissions;
    };

    // Fetch permissions from API when component mounts
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await roleApiProvider.getPermissions();
                if (response && response.status) {
                    const permissionsData = response.response.data;
                    setPermissionOptions(permissionsData);

                    // Extract unique categories (features)
                    const features = [...new Set(permissionsData.map(p => p.category))];

                    // Create feature labels mapping
                    const labels = {};
                    features.forEach(feature => {
                        labels[feature] = feature.charAt(0).toUpperCase() + feature.slice(1);
                    });
                    setFeatureLabels(labels);

                    // Determine available action types
                    const actionTypes = [...new Set(permissionsData.map(p => p.type))];
                    setAvailableActions(actionTypes);

                    setPermissionsInitialized(true);
                }
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };

        fetchPermissions();
    }, []);

    // Load role data in edit mode after permissions are initialized
    useEffect(() => {
        if (isEditMode && permissionsInitialized) {
            const fetchRoleData = async () => {
                setLoading(true);
                try {
                    const response = await roleApiProvider.getRoleById(id);
                    if (response && response.status) {
                        const role = response.response.data;
                        setRoleName(role.name);

                        // Initialize permissions with role's permissions
                        const initializedPermissions = initializePermissions(role.permissions);
                        setPermissions(initializedPermissions);
                    }
                } catch (error) {
                    console.error("Error fetching role data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRoleData();
        }
    }, [id, isEditMode, permissionsInitialized]);

    // Initialize permissions for create mode after permissions are loaded
    useEffect(() => {
        if (!isEditMode && permissionsInitialized) {
            const initializedPermissions = initializePermissions();
            setPermissions(initializedPermissions);
        }
    }, [isEditMode, permissionsInitialized]);

    // Helper: update all rows for a specific column (permission type)
    const handleSelectAllColumn = (action, checked) => {
        const updated = { ...permissions };
        Object.keys(updated).forEach((feature) => {
            if (updated[feature].hasOwnProperty(action)) {
                updated[feature][action] = checked;
            }
        });
        setPermissions(updated);
    };

    // Handle individual checkbox
    const handleCheckboxChange = (feature, action) => {
        setPermissions((prev) => ({
            ...prev,
            [feature]: {
                ...prev[feature],
                [action]: !prev[feature][action],
            },
        }));
    };

    // Check if all rows in a column are selected
    const isColumnChecked = (action) => {
        const featuresWithAction = Object.keys(permissions)
            .filter(feature => permissions[feature].hasOwnProperty(action));

        return featuresWithAction.length > 0 &&
            featuresWithAction.every(feature => permissions[feature][action]);
    };

    // Handle role name change
    const handleRoleNameChange = (e) => {
        setRoleName(e.target.value);
    };

    // Convert checkbox states to array of permission IDs for API payload
    const getSelectedPermissionIds = () => {
        const selectedIds = [];

        permissionOptions.forEach(permission => {
            if (permissions[permission.category]?.[permission.type]) {
                selectedIds.push(permission._id);
            }
        });

        return selectedIds;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setRoleNameError('');
        setPermissionError('');
    
        // Validate role name
        if (!roleName.trim()) {
            setRoleNameError('Role name is required');
            return;
        }
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(roleName.trim())) {
            setRoleNameError('Role name must contain only alphabets and spaces');
            return;
        }
        // Validate at least one permission is selected
        const selectedPermissionIds = getSelectedPermissionIds();
        if (selectedPermissionIds.length === 0) {
            setPermissionError('At least one permission must be selected');
            return;
        }
        setLoading(true);

        const formData = {
            name: roleName,
            permissions: getSelectedPermissionIds()
        };

        try {
            let result;
            if (isEditMode) {
                result = await roleApiProvider.updateRole(id, formData);
            } else {
                result = await roleApiProvider.addRoles(formData);
            }

            if (result && result.status) {
                toast.success(
                    isEditMode ? 'Role updated successfully' : 'Role created successfully'
                );
                setTimeout(() => {
                    navigate('/roles-list');
                }, 1500); 
            } else {
                console.log(result)
                toast.error(result?.message)
            }

        } catch (error) {
            console.log(error, "error")
            // Show more detailed error message
            toast.error(error.response?.data?.message ||
                error.message ||
                `An error occurred while ${isEditMode ? 'updating' : 'creating'} user`);
        } finally {
            setLoading(false);
        }
    }

    const renderPermissionRow = (featureKey) => {
        const featurePermissions = permissionOptions.filter(p => p.category === featureKey);

        return (
            <tr key={featureKey}>
                <td>{featureLabels[featureKey]}</td>
                {availableActions.map((action) => {
                    // Find the permission that matches this feature and action
                    const permission = featurePermissions.find(p => p.type === action);

                    if (permission) {
                        return (
                            <td key={action}>
                                <div className="d-flex align-items-center gap-10">
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input
                                            className="form-check-input radius-4 border input-form-dark"
                                            type="checkbox"
                                            checked={permissions[featureKey]?.[action] || false}
                                            onChange={() => handleCheckboxChange(featureKey, action)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </td>
                        );
                    }
                    return <td key={action}></td>; // Empty cell if permission type doesn't exist
                })}
            </tr>
        );
    };

    // Map API types to display labels
    const actionLabels = {
        list: 'View',
        create: 'Add',
        update: 'Edit',
        delete: 'Delete'
    };

    return (
        <>
            <div className="card h-100 mb-3 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <div className="w-50">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-20">
                                <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="name"
                                    placeholder="Enter role name"
                                    value={roleName}
                                    onChange={handleRoleNameChange}
                                    required
                                    disabled={loading}
                                />
                                {roleNameError && (
                                    <div className="text-danger">
                                        <span className='text-danger'>{roleNameError}</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6>Role permissions</h6>
                </div>
                <div className="card-body p-24">
                    {permissionsInitialized && Object.keys(permissions).length > 0 ? (
                        <div className="table-responsive scroll-sm">
                            <table className="table bordered-table sm-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        {availableActions.map((action) => (
                                            <th key={action}>
                                                <div className="d-flex align-items-center gap-10">
                                                    <div className="form-check style-check d-flex align-items-center">
                                                        <input
                                                            className="form-check-input radius-4 border input-form-dark"
                                                            type="checkbox"
                                                            checked={isColumnChecked(action)}
                                                            onChange={(e) => handleSelectAllColumn(action, e.target.checked)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    {actionLabels[action] || action}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(permissions).map((featureKey) => {
                                        return renderPermissionRow(featureKey);
                                    })}
                                </tbody>
                            </table>
                            {permissionError && (
                                <div className="text-danger">
                                    <span className='text-danger'>{permissionError}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading permissions...</p>
                    )}
                </div>
                <div className="card-footer bg-base border-top py-16 px-24">
                    <button
                        type="button"
                        className="btn btn-primary radius-8 px-24"
                        onClick={handleSubmit}
                        disabled={loading || !permissionsInitialized}
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Role' : 'Save Role'}
                    </button>
                </div>
                <ToastContainer/>
            </div>
        </>
    );
};

export default RoleNewAccessLayer;