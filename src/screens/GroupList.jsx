import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ErrorNotification from "../components/ErrorNotification";
import '../styles/Groups.css'
import { useUser } from "../context/useUser";
import axios from "axios";
const backendLink = import.meta.env.VITE_API_URL

export default function GroupList(){
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [refresh, setRefresh] = useState(false);
    //custom notification/error type
    const [type, setType] = useState("")
    const [requests, setRequests] = useState([])
    const [followers, setFollowers] = useState([])
    const {user, groups, getGroups} = useUser()
    //navigation
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            try {
                await getGroups()
                await findRequests()
                await findFollowers()
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load group data.");
            }
        }
        fetchData();
    }, [refresh])

    async function findRequests() {
        try {
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                }
            };
            const response = await axios.get(backendLink + "/group/allrequests", headers)
            setRequests(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function findFollowers() {
        try {
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                }
            };
            const response = await axios.get(backendLink + "/group/getfollowersall", headers)
            setFollowers(response.data)
            console.log(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function handleSubscribe(groupId){
        const userRequest = {
            group_id: groupId,
            user_email: user.email
        }
        const json = JSON.stringify(userRequest)
        const headers = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${user.token}`,
            }
        };        
        try{
            const response = await axios.post(backendLink + '/group/request', json, headers)
            console.log(response.data)
            if(response.data.state){
                alert(response.data.state)
                setRefresh((prev) => !prev);
            } else alert('Error occured, try again later')
        } catch (error) {
            //const message = error.message && error.response.data ? error.response.data.error : error
            setNotificationMessage('Error occured while subscribing to the group. Try to log in again')//custom error notification
            setType('error')//notification type
            console.log(error)
            setTimeout(() => {
                setNotificationMessage(null)
                setType('')
              }, 3000)
        }
    }

    function moveToAdminPanel(id){
        const checkAdm = groups.filter(group => user.email == group.admin_email)
        if (checkAdm.length > 0) {
            navigate(`/groups/admin/${id}`)
        } else {
            alert("You are not an admin!")
        }
    }

    function viewGroupPage(group_id){
        navigate(`/groups/${group_id}`)
    }

    return (
        <>
            <Navbar/>
            <ErrorNotification message={notificationMessage} type={type}/>
            <h2>List of available groups</h2>
            <div className="groups-container">
            {groups.map((group) => (
                    <div className="group-item" key={group.group_id}>
                        <img 
                            className="group-image"
                            src={`${group.photo}` || "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("} 
                            alt={`${group.group_name} photo`} 
                        />
                        <div className="group-details">
                            <p className="group-name">{group.group_name}</p>
                            <p className="group-description">{group.description}</p>
                        </div>
                        {user.email === group.admin_email ? (
                            <button 
                                className="subscribe-button" 
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation
                                    moveToAdminPanel(group.group_id);
                                }}
                            >
                                Admin panel
                            </button>
                        ) : user.token ? (
                            requests.some
                            (req => req.user_email === user.email && 
                            group.group_id === req.group_id) ? (
                                <button 
                                    className="subscribe-button" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigation
                                        alert("Your request to join the group is still pending. Wait for group admin to approve it.");
                                    }}
                                >
                                    Request pending
                                </button>
                            ) : followers.some(follower => 
                                follower.email === user.email && 
                                follower.group_ids.some(gId => gId === group.group_id)
                            ) ? (
                                <button 
                                    className="subscribe-button" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigation
                                        viewGroupPage(group.group_id); // Function to view group page
                                    }}
                                >
                                    View page
                                </button>
                            ) : (
                                <button 
                                    className="subscribe-button" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigation
                                        handleSubscribe(group.group_id);
                                    }}
                                >
                                    Subscribe
                                </button>
                            )
                        ) : (
                            <button className="subscribe-button" onClick={(e) => e.stopPropagation()}>
                                Log in to subscribe
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}