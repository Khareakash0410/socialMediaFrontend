import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

const UserPosts = () => {



   const [yourAllPosts, setYourAllPosts] =  useState([]);


    let ctx = useContext(UserContext);
    console.log(ctx);

    let token = ctx.user.token;


   const getYourAllPosts = async () => {
    let res = await axios.get("https://socialmediabackend-abt5.onrender.com/posts/getYourAllPosts",{
        headers: {
            Authorization: token
        }
    });

    let data = await res.data.posts;
    console.log(data);

    const updatedData = data.map((post) => ({
      ...post,
      timeAgo: moment(post.createdAt).fromNow(),
    }));
    setYourAllPosts(updatedData)


   }

   useEffect(() => {
      getYourAllPosts();
   }, []);

  return (
    <div className='w-full mt-4 mb-2 grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
      {
        yourAllPosts.map((ele, index) => {
            return <Link to={`/post?name=${ctx.user.loggedUserDetails.name}`} state={ele._id} key={index} className="w-[80%] h-[350px] mt-5 mx-auto bg-gradient-to-r from-slate-300 via-red-50 to-yellow-50 shadow-xl rounded-lg overflow-hidden border border-blue-300 hover:shadow-4xl transition-shadow duration-300">
            {/* Card Image */}

            

            {ele.file ? 
                   (
                       ele.file.includes("image") ? (
                         <div className='w-full h-[70%] flex justify-center'><img className='rounded-lg object-fill bg-no-repeat w-full h-full' src={ele.file} alt="" /></div>
                         
                   ) : ele.file.includes("video") ? (
                     <div className='w-full h-[70%] flex justify-center rounded-lg '> <video className='object-fill rounded-lg' controls  src={ele.file}></video></div>
                         
                   ) : ele.file.includes("audio") ? (
                     <div className='w-full flex justify-center rounded-lg items-end h-[70%] bg-[url("https://cdn.pixabay.com/photo/2016/12/06/01/30/woofer-1885354_640.png")]'><audio className='w-full' controls src={ele.file}></audio></div>
                          
                   ) : (
                          
                         <div className='w-full  rounded-lg flex justify-center items-end h-[70%] bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                             <p className='text-red-600 font-medium text-center'>Unsupported file type 🫤</p>
                         </div>
                         
                   )
                   ) : 
                   (
                     <div className='w-full flex justify-center items-end h-[70%] rounded-lg bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                     <p className='text-red-600 font-medium'>No File found😒</p>
                    </div>
                   )
       }



      
            {/* Card Content */}
     <div className="p-4">
                <div className='flex items justify-between'>
                                  {/* Title */}
              <h2 className="text-xl font-bold text-green-900 truncate line-clamp-1">
                {ele.title}
              </h2>
              <p className="text-sm line-clamp-1 text-red-400 mt-1">{ele.timeAgo}</p>
      
                </div>

              {/* Description */}
                <p className="font-light line-clamp-1">
                {ele.description}
                </p>
       
              {/* User Info */}
               <div className="flex items-center">
                <img
                  src={ele.userId.profilePic}
                  alt="User Avatar"
                  className="w-8 h-8 border-2 border-red-500 rounded-full mr-3"
                />
                
                
                <p className="text-gray-800 font-bold">{ele.userId.name}
                </p>
                </div> 
                  
     </div>
              </Link>
        })
      }
    </div>
  )
}

export default UserPosts;

