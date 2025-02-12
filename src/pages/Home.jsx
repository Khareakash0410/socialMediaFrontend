import React, { useContext, useEffect, useState } from 'react'
import PostButton from '../components/PostButton'
import axios from 'axios'
import moment from 'moment';
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { FaShareSquare } from "react-icons/fa";
import UserContext from '../context/UserContext';
import { IoMdSend } from "react-icons/io";
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { AiFillDelete } from "react-icons/ai";
import { Link } from 'react-router-dom';

const Home = () => {

  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState({})
  const [commentInput, setCommentInput] = useState({})
  
  const ctx = useContext(UserContext);
 
  
  const [allPost, SetAllPost] = useState([]);
 
  const getAllPosts = async() => {
    let res = await axios.get("https://socialmediabackend-abt5.onrender.com/posts/getAllPost");


    let data = res.data.post;



const updatedData = data.map((post) => ({
  ...post,
  timeAgo: moment(post.createdAt).fromNow(),
}));

    SetAllPost(updatedData)

  }




  const handleCommentCancel = () => {
    setCommentOpen(false);
  }

  const handleCommentClick =(ele) => {
    console.log(ele);
    setSelectedPost(ele);
    setCommentOpen(true);
  }

  const handleCommentChanger = (e, ele) => {
    // console.log(e.target.value);
    // setCommentInput(e.target.value);
    let postId = ele._id
    setCommentInput({
      ...commentInput,
      [postId] : e.target.value

    })
  }
  // console.log(commentInput);

  const handleSubmitComment = async (ele) => {
    // console.log(ele);
    let obj = {
      text: commentInput[ele._id]
    }

    let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/posts/commentPost/${ele._id}`, obj, {
      headers: {
        Authorization: ctx.user.token
      }
    });

    let data = await res.data;
    console.log(data);

    if (data.success) {
      toast.success(data.msg, {position: "top-center", theme: "colored"});
      getAllPosts();
      setCommentInput({
        ...commentInput,
        [ele._id] : ""
      });
      
      
    } 
    else {
      toast.error(data.msg, {position: "top-center", theme: "colored"})
    }
  }

  const handleDeleteComment = async (item, ele) => {
    let commentId = item._id;
    let postId = ele._id
    console.log(item._id);
    console.log(ele._id);

    let res = await axios.delete(`https://socialmediabackend-abt5.onrender.com/posts/deleteComment/${commentId}/${postId}`);


    let data = await res.data;
    console.log(data);

    if (data.success) {
      toast.success(data.msg, {position: 'top-center', theme: "colored"});
      getAllPosts();
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
    let token = ctx.user.token;
  
    let res = await axios.put(`https://socialmediabackend-abt5.onrender.com/posts/likesPost/${postId}`, {}, {
      headers: {
        Authorization: token
      }
    });

    let data = await res.data;
    console.log(data);

    if (data.success) {
      toast.success(data.msg, {position: "top-center", theme : "colored"});
      getAllPosts();
    }
    else {
      toast.error(data.msg, {position: "top-center", theme : "colored"});
    }
  }

 


 useEffect(() => {
  getAllPosts()
 }, []);



  return (

    <div className='w-full h-screen flex mt-[-80px] md:mt-[-60px] pt-16 overflow-hidden'>
      

      {/* for a home page show posts and modal for upload a new posts */}

      <div className='md:w-[75%] w-full h-full overflow-y-auto scrollbar-hide'>

         <PostButton getAllPosts={getAllPosts} />

         <div className='w-full mt-4 mb-2 grid gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
          {
             allPost.map((ele, index) => {
               return <div  key={index}  className="w-[90%] h-[400px] mt-5 mx-auto bg-gradient-to-r from-slate-300 via-red-50 to-yellow-50 shadow-xl rounded-lg overflow-hidden border border-blue-300 hover:shadow-4xl transition-shadow flex flex-col duration-300 cursor-pointer">
               {/* Card Image */}

               

               {ele?.file ? 
                      (
                          ele?.file?.includes("image") ? (
                            <Link state={ele._id} to={`/post?name=${ele.userId.name}`} className='w-full h-[50%] flex justify-center'><img className='rounded-lg object-fill bg-no-repeat w-full h-full' src={ele?.file} alt="" /></Link>
                            
                      ) : ele?.file?.includes("video") ? (
                        <Link state={ele._id} to={`/post?name=${ele?.userId?.name}`} className='w-full h-[50%] flex justify-center rounded-lg '> <video className='object-fill rounded-lg' controls  src={ele?.file}></video></Link>
                            
                      ) : ele?.file?.includes("audio") ? (
                        <Link state={ele._id} to={`/post?name=${ele?.userId?.name}`} className='w-full flex justify-center rounded-lg items-end h-[50%] bg-[url("https://media.tenor.com/b3pZMIW1I-UAAAAM/audio-beat.gif")]'><audio className='w-full h-10' controls src={ele?.file}></audio></Link>
                             
                      ) : (
                             
                            <Link state={ele._id} to={`/post?name=${ele?.userId?.name}`} className='w-full  rounded-lg flex justify-center items-end h-[50%] bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                                <p className='text-red-600 font-medium text-center'>Unsupported file type 🫤</p>
                            </Link>
                            
                      )
                      ) : 
                      (
                        <Link state={ele._id} to={`/post?name=${ele?.userId?.name}`} className='w-full flex justify-center items-end h-[50%] rounded-lg bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                        <p className='text-red-600 font-medium'>No File found😒</p>
                       </Link>
                      )
          }



         
               {/* Card Content */}
                <div className="p-6">

                {/* list of like comment share */}
                 <div className='flex justify-evenly gap-5 mb-2'>

                    {
                      ele?.likes?.includes(ctx?.user?.userId) ? 
                      (<div className='flex'>
                      < FaThumbsUp onClick={() => handleLikeClick(ele)} className='cursor-pointer' />
                      <sup className='mt-1'>{ele?.likes?.length}</sup>
                      </div>
                      ) : 
                      (
                        <div className='flex'>
                      < FaRegThumbsUp onClick={() => handleLikeClick(ele)} className='cursor-pointer' />
                      <sup className='mt-1'>{ele?.likes?.length}</sup>
                      </div>
                      )
                    }
                   
                   

                    {
                      ele?.comments?.find((comment) => comment?.user?._id === ctx?.user?.userId) ?
                       (<div className='flex '>
                       < MdMessage onClick={() => handleCommentClick(ele)} className='cursor-pointer' />
                       <sup className='mt-1'>{ele?.comments?.length}</sup>
                     
                       </div>
                       )
                        : 
                       (<div className='flex '>
                        < MdOutlineMessage onClick={() => handleCommentClick(ele)} className='cursor-pointer' />
                        <sup className='mt-1'>{ele?.comments?.length}</sup>
                        </div>
                       )
                    }
                   < FaShareSquare className='cursor-pointer' />

                  
                 </div>

               

                 {/* To write a commment */}

                 <div className='flex gap-2 mb-4'>
                  <img src={ctx.user.loggedUserDetails.profilePic} className='w-6 h-6 rounded-full border-[1px] border-blue-600' alt="" />
                  <input value={commentInput[ele?._id]} name='comment' onChange={(e) => handleCommentChanger(e, ele)} type="text" className='rounded-full border-[1px] border-black outline-none w-full bg-gray-100 text-center' placeholder='Write a comment!' />
                  <IoMdSend onClick={() => handleSubmitComment(ele)} className='cursor-pointer' size={24} />
                 </div>

                 {/* Title */}
                 <h2 className="text-xl font-bold text-green-900 truncate line-clamp-1">
                   {ele?.title}
                 </h2>
         
                 {/* Description */}
                 <p className="font-light mb-2 line-clamp-1">
                   {ele?.description}
                 </p>
         
                 {/* User Info */}
                 {/* <div className="flex items-center mt-5">
                   <img
                     src={`https://ui-avatars.com/api/?name=${username}&background=random`}
                     alt="User Avatar"
                     className="w-10 h-10 rounded-full mr-3"
                   />
                   <div> */}
                  <div className='flex justify-evenly gap-4'>
                    <img className='w-8 h-8 mt-2 border-2 border-gray-600 rounded-full object-cover' src={ele?.userId?.profilePic} alt="" /> 
                   <p className="text-gray-800 mt-2 font-extrabold w-full">{ele?.userId?.name}</p> 
                   <p className="text-sm line-clamp-1 text-red-400 ">{ele?.timeAgo}</p>
                  </div>
                     
                </div>
              </div>

                 }
                )
          }
         </div>


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
                    (<AiFillDelete className='absolute right-0 cursor-pointer top-2' color='red' onClick={() => handleDeleteComment(item, selectedPost)} size={15} />)
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


      </div>
             
            
          
       
        


      {/* this div for showing friends combo of following and folllowers */}
      <div className='w-[25%] h-full hidden md:flex overflow-y-auto scrollbar-hide'>
          <div className='w-full h-full  flex justify-evenly'>
        
             <div className='flex flex-col gap-6'>
                <h2  className='font-serif py-5 text-gray-600  hover:text-gray-900  px-2 rounded-lg text-lg'>
            Followers🙆
                </h2>
                <div className='flex flex-col items-center gap-6'>
                  {
                    ctx?.user?.loggedUserDetails?.followers?.map((ele, index) => {
                      return <Link state={ele._id} to={`/friendProfile?name=${ele.name}`} key={index} className='flex cursor-pointer flex-col items-center'>
                          <img className='w-8 h-8 rounded-full border-[1.5px] border-green-500' src={ele.profilePic} alt="" />
                          <p className='font-serif text-[16px]'>{ele.name}</p>
                      </Link>
                    })
                  }
                </div>
             </div>
        
             <div className='flex flex-col gap-6'>
                <h2 className='font-serif py-5  text-gray-600  hover:text-gray-900  px-2 rounded-lg text-lg'>
            Followings🙆‍♀️
                </h2>
                <div className='flex flex-col items-center gap-6'>
                  {
                    ctx?.user?.loggedUserDetails?.followings?.map((ele,index) => {
                      return <Link to={`/friendProfile?name=${ele.name}`} state={ele._id} key={index} className='flex cursor-pointer flex-col items-center'>
                          <img className='w-8 h-8 rounded-full border-[1.5px] border-green-500' src={ele.profilePic} alt="" />
                          <p className='font-serif text-[16px]'>{ele.name}</p>
                      </Link>
                    })
                  }
                </div>
             </div>
      
          </div>


      </div>


 
    </div>
    
  );
}

export default Home;
