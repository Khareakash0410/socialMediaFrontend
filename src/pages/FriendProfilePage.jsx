import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { Modal } from 'antd';
import { FaShareSquare } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { IoChatboxEllipses } from "react-icons/io5";

const FriendProfilePage = () => {



   let ctx = useContext(UserContext);
   console.log(ctx); 
   let token = ctx.user.token;
   const navigate = useNavigate();

  
   const location = useLocation();
   

   const friendId = location.state;

   if (friendId === ctx.user.userId) {
    navigate(`/profilePage?name=${ctx.user.loggedUserDetails.name}`, {replace : true});
   }

   console.log(friendId);
   console.log(ctx.user.userId) 

   const [followOpen , setFollowOpen] = useState(false);
   const [followingOpen, setFollowingOpen] = useState(false)
   const [commentOpen, setCommentOpen] = useState(false);
   const [comment, setComment] = useState({})
   //    console.log(comment)
   const [friend, setFriend] = useState("");
   const [friendPosts, setFriendPosts] = useState([]);
   const [selectedPost, setSelectedPost] = useState({})
   
   const getUserById = async () => {
    let res = await axios.get(`https://socialmediabackend-abt5.onrender.com/users/getUserById/${friendId}`);

    let data = await res.data.data;
    // console.log(data);
    setFriend(data);
   }

   const getFriendAllPosts = async () => {
    let res = await axios.get(`https://socialmediabackend-abt5.onrender.com/posts/getFriendAllPosts/${friendId}`);

    let data = await res.data.data;

    const updatedData = data.map((post) => ({
          ...post,
          timeAgo: moment(post.createdAt).fromNow(),
        }));

    // console.log(data);
    setFriendPosts(updatedData)
   }

   const handleFollowFollowing = async () => {
      let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/users/followFollowings/${friendId}`,{}, {
        headers: {
            "Authorization": token
        }
      });

      let data = await res.data;
      console.log(data);

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"})
        getUserById();
      }
      else {
        console.log(data.error);
        toast.error(data.msg, {position: "top-center", theme: "colored"})
      }
   }

   const handleComment = (e, ele) => {
    const postId = ele._id
    // console.log(e.target.value)
    // console.log(e.target.name)
    // setComment(e.target.value);
    setComment({
        ...comment, 
        [postId] : e.target.value
    })
   }

   const handleSubmitComment = async (ele) => {
     console.log(ele);
     let postId = ele._id;
     let token = ctx.user.token;
     let obj = {
        text: comment[postId]
     }

     let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/posts/commentPost/${postId}`, obj, {
        headers: {
            "Authorization": token
        }
     });

     let data = await res.data;
     console.log(data);

     if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"});
        getFriendAllPosts();
        setComment({
            ...comment,
            [postId] : ""
        });
        
     }

     else {
        toast.error(data.msg, {position: "top-center", theme: "colored"});
     }
   }

   const handleCommentCancel = () => {
    setCommentOpen(false);
  }

   const handleCommentClick = (ele) => {
    console.log(ele);
    setSelectedPost(ele);
    setCommentOpen(true);
   }

   const handleDeleteComment = async (item, selectedPost) => {
      console.log(item);
      console.log(selectedPost);

      let commentId = item._id;
      let postId = selectedPost._id;

      let res = await axios.delete(`https://socialmediabackend-abt5.onrender.com/posts/deleteComment/${commentId}/${postId}`);

      let data = await res.data;
      console.log(data);

      if (data.success) {
            toast.success(data.msg, {position: 'top-center', theme: "colored"});
            getFriendAllPosts();
            // setCommentOpen(false);
            setSelectedPost({
              ...selectedPost,
              comments: selectedPost.comments.filter((item) => item._id !== commentId)
            })
          }
      
          else {
            toast.error(data.msg, {position: "top-center", theme: "colored"})
          }
   }
 
   const handleLikeClick = async (ele) => {
    console.log(ele);
    let postId = ele._id;
    let token = ctx.user.token

    let res = await axios.put(`https://socialmediabackend-abt5.onrender.com/posts/likesPost/${postId}`, {}, {
        headers: {
            "Authorization" : token
        }
    });

    let data = await res.data;
    console.log(data);

    if (data.success) {
        toast.success(data.msg, {position: "top-center", theme : "colored"});
        getFriendAllPosts();
    }
    else {
        toast.error(data.msg, {position: "top-center", theme : "colored"});
    }
   }

   const handlePleaseFollow = () => {
    toast.error("Kindly Follow / Wait for Follow Back", {position: "top-center", theme: "colored"})
   }

   const handleShowFollowers = () => {
      setFollowOpen(true);
   }
   
   const handleFollowCancel = () => {
      setFollowOpen(false);
   } 

   const handleOffFollowerModal = () => {
    setFollowOpen(false);
   }

   const handleShowFollowings = () => {
      setFollowingOpen(true);
   }

   const handleFollowingCancel = () => {
    setFollowingOpen(false);
   }

   const handleOffFollowingModal = () => {
    setFollowingOpen(false);
   }


   console.log(friend);
   console.log(friendPosts);

   useEffect(() => {
    getUserById();
    getFriendAllPosts();
   }, [friendId]);



return (
                    // Profile Page body ----------------
    <div className="min-h-screen flex flex-col mt-[-80px] items-center px-4 pt-24 pb-6">



                {/* Profile Card Container */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-slate-300 via-red-50 to-yellow-50 rounded-lg shadow-lg overflow-hidden">



        {/* Friend Cover Picture that includes profile picture  */}
           <div className="relative w-full h-56">
        
         <img
            src={friend?.coverPic} 
            alt="Cover"
            className="w-full h-full object-cover"
         />
        
    


        
               {/* Profile Picture */}
        <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2">
        
            <img src={friend?.profilePic} 
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-red-500 shadow-lg"
            />


        </div>
                  
       
        

        
          
           </div>
     
     
                    {/* Friend Details Section */}
           <div className="pt-16 pb-6 px-4 text-center">


                        {/* Name */}
           <div className='flex justify-center items-center gap-1'>
<h1 className="text-2xl font-bold text-gray-800">   {friend?.name}
</h1>

           </div>







                       {/* City */}
           <div className='flex justify-center items-center gap-1'>
<h2 className='font-serif  text-2xl  mb-1'>
{friend?.city}
</h2>

           </div>




 




                        {/* Bio */}
            <div className='flex gap-1 justify-center items-center'>
<p className="text-gray font-serif font-600 mt-2">
{
friend?.bio
}
</p>

            </div>






        
        
                    {/* Action Buttons */}
            <div className="mt-4 flex justify-center gap-4">
             <div>

            {
             friend?.followers?.some((follower) => follower._id === ctx?.user?.userId) ? 
             (  <button onClick={handleFollowFollowing} className="bg-red-300 text-gray-700 px-4 py-2 rounded-lg shadow font-serif hover:bg-red-400">
                Unfollow
                </button>
             ) : 
             (
              <button onClick={handleFollowFollowing} className="bg-green-500 text-white px-4 py-2 rounded-lg font-serif shadow hover:bg-green-600">
                  Follow
              </button>
             )
            }
             </div>
             <Link state={friend} to={`/friendProfile/friendChat?name=${friend.name}`}>
              <IoChatboxEllipses className='cursor-pointer hover:fill-green-500' size={25} fill='green' />
             </Link>
             
            </div>


                {/* Action Button for Follow & Followings */}
       
            {
             friend?.followers?.some((follower) => follower._id === ctx?.user?.userId) &&
              ctx?.user?.loggedUserDetails?.followers?.some((follower) => follower?._id === friend?._id) ?
              (
                <div className="mt-4 flex justify-center gap-4">
                <button onClick={handleShowFollowers} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-serif shadow hover:bg-blue-800">
                  Followers <sup>{friend?.followers?.length}</sup>
                </button>
                <button onClick={handleShowFollowings} className="bg-green-400 text-gray-700 px-4 py-2 rounded-lg shadow font-serif hover:bg-green-700">
                  Followings <sup>{friend?.followings?.length}</sup>
                </button>
                </div>
              ) :
             (<div className="mt-4 flex justify-center gap-4">
              <button onClick={handlePleaseFollow} className="bg-blue-500 cursor-not-allowed text-white px-4 py-2 rounded-lg font-serif shadow ">
                Followers <sup>{friend?.followers?.length}</sup>
              </button>
              <button onClick={handlePleaseFollow} className="bg-green-400 cursor-not-allowed text-gray-700 px-4 py-2 rounded-lg shadow font-serif ">
                Followings <sup>{friend?.followings?.length}</sup>
              </button>
              </div>
              )
            }

           

           



           </div>


                      {/* Friend All Posts */}

      {
        friendPosts?.length > 0 ? 
         ( <div className='w-[99%] mb-2 ml-1 cursor-pointer grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
            {
              friendPosts?.map((ele, index) => {
                  return <Link to={`/post?name=${friend?.name}`} state={ele._id} key={index} className="w-full h-[400px] mt-5 mx-auto bg-gradient-to-r from-slate-300 via-red-50 to-yellow-50 shadow-xl rounded-lg overflow-hidden border border-blue-300 hover:shadow-4xl transition-shadow duration-300">
                  {/* Card Image */}
      
                  
      
                  {ele?.file ? 
                         (
                             ele?.file?.includes("image") ? (
                               <div className='w-full h-[50%] flex justify-center'><img className='rounded-lg object-fill bg-no-repeat w-full h-full' src={ele?.file} alt="" /></div>
                               
                         ) : ele?.file?.includes("video") ? (
                           <div className='w-full h-[50%] flex justify-center rounded-lg '> <video className='object-fill rounded-lg' controls  src={ele?.file}></video></div>
                               
                         ) : ele?.file?.includes("audio") ? (
                           <div className='w-full flex justify-center rounded-lg items-end h-[50%] bg-[url("https://cdn.pixabay.com/photo/2016/12/06/01/30/woofer-1885354_640.png")]'><audio className='w-full' controls src={ele?.file}></audio></div>
                                
                         ) : (
                                
                               <div className='w-full  rounded-lg flex justify-center items-end h-[50%] bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                                   <p className='text-red-600 font-medium text-center'>Unsupported file type 🫤</p>
                               </div>
                               
                         )
                         ) : 
                         (
                           <div className='w-full flex justify-center items-end h-[50%] rounded-lg bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                           <p className='text-red-600 font-medium'>No File found😒</p>
                          </div>
                         )
             }
      
      
      
            
                  {/* Card Content */}
           <div className="p-4">
                    {/* list of likes comment and share */}
                    <div className='flex justify-evenly gap-5 mb-2'>

                        {
                            ele?.likes?.includes(ctx?.user?.userId) ? 
                            (<div className='flex'>
                             <FaThumbsUp onClick={() => handleLikeClick(ele)} />
                             <sup className='mt-1'>{ele?.likes?.length}</sup>
                             </div>)
                               : 
                            (<div className='flex'>
                             <FaRegThumbsUp onClick={() => handleLikeClick(ele)} />
                             <sup className='mt-1'>{ele?.likes?.length}</sup>
                             </div> )
                        }

                        {
                            ele?.comments?.find((comment) => comment?.user?._id === ctx?.user?.userId) ? 
                            (<div className='flex'>
                            <MdMessage className='cursor-pointer' onClick={() => handleCommentClick(ele)} />
                            <sup className='mt-1'>{ele?.comments?.length}</sup>
                            </div>) 
                              : 
                            (<div className='flex'>
                             <MdOutlineMessage className='cursor-pointer' onClick={() => handleCommentClick(ele)} />
                             <sup className='mt-1'>{ele?.comments?.length}</sup>
                             </div>)
                        }
                    
                      <FaShareSquare />
                    </div>

                    {/* To write a comment */}
                     <div className='flex gap-2 mb-4'>
                                      <img src={ctx?.user?.loggedUserDetails?.profilePic} className='w-6 h-6 rounded-full border-[1px] border-blue-600' alt="" />
                                      <input value={comment[ele?._id]} onChange={(e) => handleComment(e, ele)}  name='comment'  type="text" className='rounded-full border-[1px] border-black outline-none w-full bg-gray-100 text-center' placeholder='Write a comment!' />
                                      <IoMdSend onClick={() => handleSubmitComment(ele)} className='cursor-pointer' size={24} />
                     </div>

                      <div className='flex items justify-between'>
                                        {/* Title */}
                    <h2 className="text-xl font-bold text-green-900 truncate line-clamp-1">
                      {ele?.title}
                    </h2>
                    <p className="text-sm line-clamp-1 text-red-400 mt-1">{ele?.timeAgo}</p>
            
                      </div>
      
                    {/* Description */}
                      <p className="font-light line-clamp-1 mb-2">
                      {ele?.description}
                      </p>
             
                    {/* User Info */}
                     <div className="flex items-center">
                      <img
                        src={friend?.profilePic}
                        alt="User Avatar"
                        className="w-8 h-8 border-2 border-red-500 rounded-full mr-3"
                      />
                      
                      
                      <p className="text-gray-800 font-bold">{friend?.name}
                      </p>
                      </div> 
                        
           </div>
                    </Link>
              })
            }
           </div> 
         ) : 
         (
           <div className='flex h-10 justify-center items-center'>
            <p className='font-bold text-lg text-red-500'>No Posts Found.</p>
           </div>
         )
      }        


              {/* Modal for showing all comments */}
               <Modal
       className="custom-modal"
       open={commentOpen}
       onCancel={handleCommentCancel}
       footer={""}
       >


     <div className="min-h-full flex  justify-center mt-5">

     {
      selectedPost?.comments?.length > 0 ? 
      (<div className="w-full max-w-lg flex flex-col gap-4 bg-green-100 shadow-md rounded-lg p-6">
        {
          selectedPost?.comments?.map((item, index) => {
            return <div key={index} className='bg-green-50 relative rounded-lg cursor-not-allowed p-1'>
                <div className='flex gap-1'>
                  <img src={item?.user?.profilePic} className='h-7 w-7 rounded-full border-[1px] border-red-400 ' alt="" />
                  <h4 className='font-bold mt-1 text-sm'>{item?.user?.name}</h4>
                </div>

                <div className='font-serif ml-8 line-clamp-3 text-gray-700 text-sm w-full'>
                  <p>{item?.text}</p>
                </div>

                {
                  item?.user?._id === ctx.user.userId ? 
                    (<AiFillDelete onClick={() => handleDeleteComment(item, selectedPost)} className='absolute right-0 cursor-pointer top-2' color='red' size={15} />)
                     : 
                     ("")
                }
                

            </div>
          })
        }  
       </ div>) : 
      (<div className="w-full max-w-lg bg-green-100 shadow-md rounded-lg p-6 font-bold text-sm text-red-400"> No Comments Here.... 
       </div>) 
     }

      

     </ div>


               </Modal>
      

               {/* Modal for show Followers */}

               <Modal
       className="custom-modal"
       open={followOpen}
       onCancel={handleFollowCancel}
       footer={""}
       >


     <div className="min-h-full flex  justify-center mt-5">

     
      <div className="w-full max-w-lg flex flex-col gap-4 bg-green-100 shadow-md rounded-lg p-6">

        {
          friend?.followers?.map((follower, index) => {
            return <Link onClick={handleOffFollowerModal} to={`/friendProfile?name=${follower.name}`} state={follower._id} key={index} className='flex w-full gap-3 px-16 py-1 bg-slate-400 hover:text-black rounded-lg'>

              <img src={follower?.profilePic} className='h-7 w-7 border-[1px] border-red-500 rounded-full' alt="" />
              <h4 className='font-serif mt-[4px]'>{follower?.name}</h4>

            </Link>
          })
        }
         
       </ div>
      
     

      

     </ div>


               </Modal>


               {/* Modal for Show Followings */}

               <Modal
       className="custom-modal"
       open={followingOpen}
       onCancel={handleFollowingCancel}
       footer={""}
       >


     <div className="min-h-full flex  justify-center mt-5">

     
      <div className="w-full max-w-lg flex flex-col gap-4 bg-green-100 shadow-md rounded-lg p-6">

        {
          friend?.followings?.map((following, index) => {
            return <Link onClick={handleOffFollowingModal} to={`/friendProfile?name=${following.name}`} state={following._id} key={index} className='flex w-full gap-3 px-16 py-1 hover:text-black bg-slate-400 rounded-lg'>

              <img src={following?.profilePic} className='h-7 w-7 border-[1px] border-red-500 rounded-full' alt="" />
              <h4 className='font-serif mt-[4px]'>{following?.name}</h4>

            </Link>
          })
        }
         
       </ div>
      
     

      

     </ div>


               </Modal>

        </div>






            

            
        
         
    </div>



    
  )
}

export default FriendProfilePage;
