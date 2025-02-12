import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserContext from '../context/UserContext';
import { IoMdSend } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios';
import { toast } from 'react-toastify';

const PostPage = () => {
    const [post, setPost] = useState("")  
    let ctx = useContext(UserContext);
    const location = useLocation();
    const postId = location.state;
    console.log(postId);

    let commentRef = useRef();

    const [modal, setModal] = useState(false);
    const [media, setMedia] = useState("")

    


    const getPostById = async () => {
      let res = await axios.get(`https://socialmediabackend-abt5.onrender.com/posts//getPostById/${postId}`);
      let data = await res.data;
      console.log(data);
      if (data.success) {
        setPost(data.findPost);
      }
    }

    const handleLikeDislikePost = async (ele) => {
      const postId = ele?._id;
      let token = ctx.user.token;
      const res = await axios.put(`https://socialmediabackend-abt5.onrender.com/posts/likesPost/${postId}`,{}, {
        headers: {
          "Authorization": token
        }
      });

      const data = await res.data
      console.log(data);

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"})
        getPostById();
      }
      else {
        toast.error(data.msg, {position: "top-center", theme: "colored"})
      }

    }

    const handleComment = async () => {
      console.log(commentRef.current.value);
      let obj = {
        text: commentRef.current.value
      }
      let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/posts/commentPost/${postId}`,obj,{
        headers: {
          "Authorization": ctx.user.token
        }
      });

      let data = await res.data;
      console.log(data);

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"})
        getPostById();
        commentRef.current.value = ""
      }
      else {
        toast.error(data.msg, {position: "top-center", theme: "colored"});
      }
    }

    const handleDeleteComment =  async (commentId) => {
      let res = await axios.delete(`https://socialmediabackend-abt5.onrender.com/posts/deleteComment/${commentId}/${postId}`);

      let data = await res.data;
      console.log(data); 

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"}); 
        getPostById();
      }
       else {
        toast.error(data.msg, {position: "top-center", theme: "colored"}); 
       }
    }

    const MediaModal = (file) => {
     setMedia(file);
     setModal(true)
    }

    useEffect(() => {
      getPostById();
    },[]);



return (
<div className="max-w-3xl flex flex-col md:flex-row w-[90%]  items-center  mx-auto  md:mt-28  px-3 mt-[120px] bg-gray-700 shadow-lg rounded-lg">
 


                {/* Left */}
  <div className="md:w-[50%] w-full mt-2">
      {
        post?.file ? (
          post?.file?.includes("image") ? (
            <div onClick={() => MediaModal(post?.file)} className='mx-auto sm:w-72 w-56'>
                  <img src={post?.file} className='sm:w-72 sm:h-72 w-56 h-56 cursor-cell rounded-lg border-[1px] border-red-500 ' alt="" />
            </div>
           
          ) : (
            post?.file?.includes("video") ? (
              <div onClick={() => MediaModal(post?.file)} className='mx-auto sm:w-72 w-56 border-[1px] border-red-500'>
                       <video className='object-cover cursor-cell sm:w-72 sm:h-72 w-56 h-56 rounded-lg' controls  src={post?.file}></video>
              </div>
           
            ) : (
              post?.file?.includes("audio") ? (
                 <div  className='sm:w-72 cursor-not-allowed sm:h-72 w-56 h-56 mx-auto flex items-end  rounded-lg bg-[url("https://media.tenor.com/b3pZMIW1I-UAAAAM/audio-beat.gif")]'>
                  <audio className='sm:h-10 h-8  sm:w-72 w-56' controls src={post?.file}></audio>
                 </div>
              ) : (
                <div className='sm:w-72 cursor-not-allowed sm:h-72 w-56 h-56 flex items-end justify-center mx-auto  rounded-lg bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
                    <p className='text-red-600 font-medium text-center'>Unsupported file type 🫤</p>
                </div>
              )
            )
          )
        ) : (
          <div className='sm:w-72 sm:h-72 w-56 *:h-56 cursor-not-allowed mx-auto flex items-end justify-center rounded-lg bg-[url("https://png.pngtree.com/element_our/20200610/ourmid/pngtree-not-found-image_2238448.jpg")]'>
              <p className='text-red-600 font-medium'>No File found😒</p>
          </div>
        )
       
      }
   
    <div className='flex flex-col pt-5 gap-3 '>
   <h1 className="text-2xl text-center text-white capitalize font-serif mb-2">{post?.title}</h1>
  {/* Description */}
  <p className="text-white text-center mb-4 px-2 font-serif">
{
    post?.description
}  </p>
    </div>

  </div>



                {/* Right */}
  <div className='flex items-center gap-6 flex-col w-full md:w-[50%] mt-8 mb-2'>

     <Link to={`/friendProfile/?name=${post?.userId?.name}`} state={post?.userId?._id} className='flex cursor-pointer flex-col gap-2 items-center'>
        <img src={post?.userId?.profilePic} className='w-16 h-16 rounded-full border-[1px] border-red-500 ' alt="" />
        <h2 className='font-serif text-white'>{post?.userId?.name}</h2>
     </Link>

     <div className='flex gap-5'>

        {
            post?.likes?.includes(ctx.user.userId) ? (<button onClick={() => handleLikeDislikePost(post)} className='border-2 border-white rounded-md px-2 py-[2px] bg-red-400'>
                Dislike Post
           </button>) : (<button onClick={() => handleLikeDislikePost(post)}  className='border-2 border-white rounded-md px-2 py-[2px] bg-green-400'>
                Like Post
           </button>)
        }
        
       
     </div>

     <div className='flex w-[90%] justify-between flex-col border-2 border-white h-full rounded-lg p-1'>
        <div className='h-[180px] flex flex-col gap-3 ml-1 overflow-y-auto scrollbar-hide'>
       {
            post?.comments?.map((comment, index) => {
                return <div key={index} className='flex flex-col'>
                     <div className='flex gap-1 relative'>
                        <img className='w-5 h-5 rounded-full border-[1px] border-red-500' src={comment?.user?.profilePic} alt="" />
                        <h4 className='font-serif text-white mt-[-2px]'>{comment?.user?.name}</h4>
                        {
                            comment?.user?._id === ctx.user.userId ? (<AiFillDelete onClick={() => handleDeleteComment(comment?._id)} className='absolute right-4 top-1 cursor-pointer' fill='red' size={12} />) : ("")
                        }
                     </div>
                     <div className='ml-6'>
                        <p className='text-yellow-200 font-serif text-xs'>
                            {comment?.text}
                        </p>
                     </div>
                </div>
            })
        }
        </div> 


        <div className='flex justify-center gap-2 w-full'>
            <input ref={commentRef} placeholder='Write a comment.....' className='rounded-lg w-full focus:outline-none text-sm text-center' type="text" name="" id="" />
            <IoMdSend  onClick={handleComment}  className='cursor-pointer' size={20} fill='red' />
        </div>
     </div>

  </div>
 

               {/* Media Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setModal(false)}
          >
            ✖
          </button>
          {media.includes("image") && (
            <img src={media} className="max-w-full max-h-full" alt="Media" />
          )}
          {media.includes("video") && (
            <video className="max-w-full max-h-full" controls src={media}></video>
          )}
        </div>
      )}
</div >
 


  )
}

export default PostPage
