import React, { useState } from 'react';

export default function UpdateForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className='update'>
            <h2>Update Username and Password</h2>

            <div>
                <span>Username</span>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder='Enter your username'
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <span>Password</span>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" >
                Update
            </button>

        </div>
    );
};


