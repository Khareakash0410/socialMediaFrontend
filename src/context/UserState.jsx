import React, { useEffect, useState } from 'react'
import UserContext from './UserContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { toast } from 'react-toastify'

const UserState = (props) => {

let userDetails = JSON.parse(localStorage.getItem("userLogin"));
  
const [user, setUser] = useState({
    login: userDetails ? userDetails.login : false,
    token: userDetails ? userDetails.token : "",
    userId: userDetails ? userDetails.userId : "",
    loggedUserDetails: ""

})



const addUser = (ans) => {
  

    const decoded = jwtDecode(ans.token)
    const UserId = decoded.id;

    // console.log(UserId)
    // console.log(ans)

    // page refresh hone se save karne ke liye use local storage

    localStorage.setItem("userLogin", JSON.stringify({
        login: true,
        token: ans.token,
        userId: UserId
    }));

    setUser({
        login: true,
        token: ans.token,
        userId: UserId
    });

}

const removeUser = () => {
    localStorage.removeItem("userLogin");
    setUser({
        login: false, 
        token: "",
        userId: ""
    });
}


const loginUserDetails = async () => {
    if (user.login) {
        try {
            let res = await axios.get("https://socialmediabackend-abt5.onrender.com/users/getUserDetails", {
                headers: {
                    Authorization : user.token
                }
            });
        
            let data = await res.data.data
            // console.log(data);
            setUser({
                ...user,
                loggedUserDetails: data
            });
        } catch (error) {
            toast.error("Failed to get Details", {position: "top-center", theme: "colored"})
            console.log(error);
        }
    }
    
}


useEffect(() => {
    loginUserDetails();
  },[user.login])





  return (
    
    <UserContext.Provider value={{user, addUser, removeUser, loginUserDetails}}>
          {props.children}
    </UserContext.Provider>
  )
}

export default UserState;
