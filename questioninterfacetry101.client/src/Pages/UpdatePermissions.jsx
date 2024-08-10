import React, { useState } from 'react';
import axios from 'axios';

const UpdatePermissions = () => {
    const [permissions, setPermissions] = useState([]);

    const handleInputChange = (e) => {
        const { value, checked } = e.target;
        setPermissions((prevPermissions) =>
            checked ? [...prevPermissions, value] : prevPermissions.filter((perm) => perm !== value)
        );
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/api/user/permissions', permissions);
            alert('Permissions updated successfully');
        } catch (error) {
            console.error('Error updating permissions', error);
        }
    };

    return (
        <div>
            <h2>Update User Permissions</h2>
            <label>
                <input type="checkbox" value="perm1" onChange={handleInputChange} /> Permission 1
            </label>
            <label>
                <input type="checkbox" value="perm2" onChange={handleInputChange} /> Permission 2
            </label>
            <button onClick={handleSubmit}>Update Permissions</button>
        </div>
    );
};

export default UpdatePermissions;
