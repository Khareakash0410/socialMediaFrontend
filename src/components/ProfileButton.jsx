import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';


const ProfileButton = () => {

  let ctx = useContext(UserContext);



    const [open, setOpen] = useState(false);
   
   const handleClick = () => {
     setOpen((prev) => !prev
     )
   }

   const handleProfile = () => {
    setOpen((prev) => !prev)
   }
   const handleLogout = () => {
    setOpen((prev) => !prev)
    ctx.removeUser();
    toast.error("Oops! You are logged out", {position: "top-right", theme: "colored"})
   }

  return (
    <div className="relative inline-block">



    <button onClick={handleClick}  className="inline-flex items-center border-0 py-1 px-3 focus:outline-none border-1 rounded text-base mt-4 md:mt-0">
    <img  src={ctx?.user?.loggedUserDetails?.profilePic ? ctx.user.loggedUserDetails.profilePic: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png?v=2024122217" } className="w-7 h-7 rounded-full" alt="" />
    </button>


     {
        open && (
        <div className="absolute -right-30  md:right-0 mt-2 w-40 bg-green-200 border border-black rounded shadow-lg">
        <Link to={`/profilePage?name=${ctx.user.loggedUserDetails.name}`} onClick={handleProfile} className="block text-center px-4 py-2 text-gray-700 hover:bg-green-400">Profile</Link>
        <Link to={`/posts?name=${ctx.user.loggedUserDetails.name}`} onClick={handleProfile} className="block text-center px-4 py-2 text-gray-700 hover:bg-green-400">Posts</Link>
        <Link to="" onClick={handleLogout} className="block text-center px-4 py-2 text-gray-700 hover:bg-red-400">Logout</Link>
     </div>
     )
     }
     



</div>

  )
}

export default ProfileButton;
