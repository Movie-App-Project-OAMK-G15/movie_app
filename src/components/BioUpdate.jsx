import React, { useState, useEffect } from 'react';
import { useUser } from '../context/useUser'; 
import axios from 'axios';
import '../styles/BioUpdate.css'
const backendLink = import.meta.env.VITE_API_URL

const BioUpdate = () => {
    const { user } = useUser (); 
    const [bio, setBio] = useState(''); 
    const [message, setMessage] = useState(''); 
    const [error, setError] = useState(''); 
    const [isEditing, setIsEditing] = useState(false); 
    
    useEffect(() => {
        const fetchBio = async () => {
            try {
                const response = await axios.get( backendLink + `/user/bio/${user.id}`, {
                    headers: {
                        'Authorization': user.token
                    }
                });
                setBio(response.data.bio); 
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Failed to fetch bio.';
                setError(errorMessage); 
            }
        };

        fetchBio(); 
    }, [user.id, user.token]); 

    const handleBioChange = (event) => {
        setBio(event.target.value); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        setError(''); 
        setMessage(''); 

        try {
            const response = await axios.put( backendLink + `/user/bio/${user.id}`, { bio }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            });
            setMessage(response.data.message);
            setIsEditing(false); 
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update bio.';
            setError(errorMessage); 
        }
    };

    const handleEditClick = () => {
        setIsEditing(true); 
        setMessage(''); 
        setError(''); 
    };

    return (
        <div className="bio-update">
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <h3 className='bio-text'>Update Your Bio</h3>
                    <textarea
                        value={bio}
                        onChange={handleBioChange}
                        placeholder="Write your bio here..."
                        rows="4"
                        className="form-control"
                    />
                    <button type="submit" className=" buttn btn-saveBio mt-2">Save Bio</button>
                    {message && <p className="text-success">{message}</p>}
                    {error && <p className="text-danger">{error}</p>}
                </form>
            ) : (
                <div>
                    <h4 className='bio-text'><strong>Your Bio:</strong></h4>
                    <p className='bio-box'>{bio}</p> 
                    <button className="buttn btn-editBio mt-2" onClick={handleEditClick}>
                        Edit
                        <i class="bi bi-pencil-square"></i>    
                    </button>
                </div>
            )}
        </div>
    );
};

export default BioUpdate;
