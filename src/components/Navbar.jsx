import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext';
import ProfileButton from './ProfileButton';
import { FaLocationDot } from "react-icons/fa6";
import { BsFillChatSquareHeartFill } from "react-icons/bs";
import { IoNotificationsCircle } from "react-icons/io5";


const Navbar = () => { 

   const [search, setSearch] = useState([]);  
   const [inputValue, setInputValue] = useState(''); // Track input value


   let ctx = useContext(UserContext);

//    console.log(ctx)
   const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(true);
   const handleRegister = () => {
     navigate("/signup")
   }

   const handleNameChange = async (e) => {
//      console.log(e.target.name); 
//      console.log(e.target.value)
        const value = e.target.value;
        setInputValue(value); // Update input value state
     
        let res = await fetch(`https://socialmediabackend-abt5.onrender.com/users/getUserBySearch?q=${value}`,{
            method: "GET",
            headers: {
                  "Content-Type": "application/json"
            }
        });

        let data = await res.json();
       let newData = data.filter((item) =>  item._id !== ctx.user.userId)
        console.log(newData);
      //   console.log(data);
        setSearch(newData);
   }

   const handleLinkClick = () => {
      setSearch([]); // Clear search results
      setInputValue(''); // Clear input field
   };
//   console.log(search);

  return (
        <div className="container fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400  mx-auto flex flex-wrap px-5 py-2 flex-col md:flex-row items-center">
            <Link to={"/"} className="flex title-font justify-center font-medium items-center text-gray-900 mb-5 md:mb-0">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-10 h-10 text-white p-2 bg-red-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-3 bg-gradient-to-r from-blue-800 to-green-500 bg-clip-text text-transparent text-3xl font-extrabold">Instamart</span>
            </Link>


           {
            ctx.user.login === true ? (
               <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base gap-4 justify-center">

              <div className='relative'>
                  <input value={inputValue} onChange={handleNameChange} name='name' type="text" className='border bg-red-100 mr-5 text-center rounded-md w-96 px-16 focus:outline-none py-[6px]' placeholder='Search for a friend or user......' />

                  <div className='absolute bg-gray-700 rounded-md mt-5 w-96 max-h-40 overflow-y-auto scrollbar-hide  z-10 shadow-lg'> 
                    {
                        search.map((ele, index) => {
                              return <Link state={ele._id}  to={`/friendProfile?name=${ele.name}`} key={index} onClick={handleLinkClick}className='flex py-2 border-b-[1px] cursor-pointer px-10  gap-4'>
                                    <img className='w-9 h-9 p-1 rounded-full' src={ele?.profilePic} alt="" />
                                    <p className='mt-2 w-fit text-white'>
                                             {ele?.name}
                                    </p>
                                    <p className='flex mt-2 text-yellow-200'>
                                          <FaLocationDot className='mt-1' color='red'/>
                                          {ele?.city}
                                    </p>
                              </Link>
                        })
                    }
                  </div>
              </div>
                  

                  
                  <Link to={`/Chats?name=${ctx?.user?.loggedUserDetails?.name}`} className="mr-5 hover:text-green-600">
                  <BsFillChatSquareHeartFill size={20} /> 
                  </Link>

                  <div to={""} className="mr-5 cursor-pointer hover:text-green-600">
                  <IoNotificationsCircle size={27} /> 
                  </div>

                  {
                              ctx?.user?.loggedUserDetails?.city ? (<div className='flex justify-center items-center cursor-not-allowed'> <FaLocationDot color='red'/>
                                    <p className='mt-1 text-sm text-gray-700 font-serif'>{ctx?.user?.loggedUserDetails?.city ? ctx.user.loggedUserDetails.city : ""}</p>
                                </div>) : ("")
                  }
                     
               </nav>
            ) : 
            (
                  <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                  <input type="text" disabled className='border mr-5 cursor-not-allowed text-center placeholder:text-black rounded-md w-96 px-16 focus:outline-none py-[6px] focus:bg-silver' placeholder='Login to Search Anyone......' />
                  </nav>
            )
           }
   



           {
            ctx.user.login === true ? 
            (
                  <ProfileButton />
            ) : 
            (
                  <button onClick={handleRegister} className="inline-flex items-center bg-red-400 border-0 py-1 px-3 focus:outline-none hover:bg-red-200 rounded-md text-base mt-4 md:mt-0">New here !
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  </button>
            )
           }
     
          

           
        </div>

  )
}

export default Navbar;
