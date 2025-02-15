import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext';
import ProfileButton from './ProfileButton';
import { FaLocationDot } from "react-icons/fa6";
import { BsFillChatSquareHeartFill } from "react-icons/bs";
import { IoNotificationsCircle } from "react-icons/io5";
import { toast } from 'react-toastify';


const Navbar = () => { 

   const [search, setSearch] = useState([]);  
   const [inputValue, setInputValue] = useState(''); // Track input value


   let ctx = useContext(UserContext);


   const [open ,setOpen] = useState(false);

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
     
        let res = await fetch(`https://socializerbackend.onrender.com/users/getUserBySearch?q=${value}`,{
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

    const handleLogout = () => {
       ctx.removeUser();
       toast.error("Oops! You are logged out", {position: "top-right", theme: "colored"})
      }




  return (
        <div className="container justify-around fixed max-w-full top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400  mx-auto flex  px-5 py-2  flex-row items-center">
           



           {
      ctx.user.login === true ?
       ( <>
            <button onClick={() => setOpen(!open)} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 mt-2  text-sm text-gray-500 rounded-lg md:hidden focus:outline-none">
  <span className="sr-only">Open sidebar</span>
  <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
  </svg>
</button>



<aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-48 h-screen/2  transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:-translate-x-full`} aria-label="Sidebar">


  <div className="h-full px-3 py-4 relative rounded-md overflow-y-auto bg-cyan-100">
   <span onClick={() => setOpen(!open)} className='absolute top-1 font-semibold right-2'>
      X
   </span>
    

    <ProfileButton /> 
    <span className='cursor-not-allowed underline font-serif text-lg '>
    {ctx?.user?.loggedUserDetails?.name}
    </span>


    <ul className="mt-3 space-y-2 font-medium">

      <li>
        <Link to="/" onClick={() => setOpen(!open)} className="flex items-center p-2 text-gray-900 rounded-lg  group">
          <svg className="w-5 h-5 text-gray-500 transition duration-75 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
          </svg>
          <span className="ms-3">Home</span>
        </Link>
      </li>

      <li>
        <Link to={`/Chats?name=${ctx?.user?.loggedUserDetails?.name}`} onClick={() => setOpen(!open)} className="flex items-center p-2 text-gray-900 rounded-lg  group">
          <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
          <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full ">New</span>
        </Link>
      </li>

      <li>
        <Link to="/" onClick={() => setOpen(!open)} className="flex items-center p-2 text-gray-900 rounded-lg  group">
          <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Notification</span>
        </Link>
      </li>

      <li>
        <Link to="/" onClick={() => setOpen(!open)} className="flex items-center p-2 text-gray-900 rounded-lg group">
          <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">City</span>
        </Link>
      </li>

      <li>
        <div onClick={handleLogout} className="flex items-center p-2 text-gray-900 cursor-wait rounded-lg  group">
          <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Log Out</span>
        </div>
      </li>
     
    </ul>


  </div>
</aside>
         </> 
       )
      : 
      ("")
           }



           {
            ctx.user.login === true ? 
                ( <Link to={"/"} className="mx-auto title-font hidden lg:flex lg:justify-center font-medium lg:items-center text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-10 h-10 text-white p-2 bg-red-500 rounded-full" viewBox="0 0 24 24">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                 </svg>
                 <span className="ml-3 bg-gradient-to-r  from-blue-800 to-green-500 bg-clip-text text-transparent text-3xl font-extrabold">Socializer</span>
               </Link>)
                : 
              (<Link to={""} className=" title-font flex justify-center font-medium items-center text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-10 h-10 text-white p-2 bg-red-500 rounded-full" viewBox="0 0 24 24">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                 </svg>
                 <span className="ml-3 bg-gradient-to-r  from-blue-800 to-green-500 bg-clip-text text-transparent text-3xl font-extrabold">Socializer</span>
               </Link>)
           }
           
           


           {
            ctx.user.login === true ? (
               <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base gap-4 justify-center">

              <div className='relative'>
                  <input value={inputValue} onChange={handleNameChange} name='name' type="text" className='border bg-red-100 lg:mr-5 text-center rounded-md mx-auto w-[300px] sm:w-[500px] md:w-96 px-4 md:px-16 focus:outline-none py-[6px]' placeholder='Search for a friend or user......' />

                  <div className='absolute bg-gray-700 rounded-md mt-5 w-[325px] sm:w-[500px] md:w-96 max-h-40 overflow-y-auto scrollbar-hide  z-10 shadow-lg'> 
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
                  

                  
                  <Link to={`/Chats?name=${ctx?.user?.loggedUserDetails?.name}`} className="mr-5 hidden md:flex hover:text-green-600">
                  <BsFillChatSquareHeartFill size={20} /> 
                  </Link>

                  <div to={"/"} className="mr-5 cursor-pointer hidden md:flex hover:text-green-600">
                  <IoNotificationsCircle size={27} /> 
                  </div>

                  {
                              ctx?.user?.loggedUserDetails?.city ? (<div className='md:flex md:justify-center hidden  md:items-center cursor-not-allowed'> <FaLocationDot color='red'/>
                                    <p className='mt-1 text-sm text-gray-700 font-serif'>{ctx?.user?.loggedUserDetails?.city ? ctx.user.loggedUserDetails.city : ""}</p>
                                </div>) : ("")
                  }
                     
               </nav>
            ) : 
            (
                  <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                  <input type="text" disabled className='border mr-5 hidden md:flex cursor-not-allowed text-center placeholder:text-black rounded-md w-96 px-16 focus:outline-none py-[6px] focus:bg-silver' placeholder='Login to Search Anyone......' />
                  </nav>
            )
           }
   



           {
            ctx.user.login === true ? 
            (
                  <span className="hidden md:flex">
                         <ProfileButton  />
           
                        </span>
             ) : 
                 
            (
                  <button onClick={handleRegister} className="inline-flex items-center bg-red-400 border-0 py-1 px-3 focus:outline-none hover:bg-red-200 rounded-md text-base md:mt-0">New here !
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
