//This is a utility function to Get the User form User Management with the help of axios.

import axios from 'axios';

const USER_MANAGEMENT_URL = process.env.USER_MANAGEMENT_URL || "http://localhost:8000/api/v1/user/getCurrentUser"


export const fetchUserData = async(token)=>{
    try {
        
        const response = await axios.get(USER_MANAGEMENT_URL, {
            headers :{
                Authorization: `Bearer ${token}`
            }
           
   

        })
        console.log(token)
        return response.data
    } catch (error) {
        throw error
    }
}