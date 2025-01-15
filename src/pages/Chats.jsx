import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../context/UserContext'
import _ from "lodash"
import { Link, useNavigate } from 'react-router-dom';
import { MdSend, MdVideoCall, MdCall } from 'react-icons/md';
import { FaRegSmile } from 'react-icons/fa'
import axios from 'axios';
import moment from 'moment';
import { io } from "socket.io-client";
import { FaUserFriends } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { TbFriendsOff } from "react-icons/tb";

const Chats = () => {
    let ctx = useContext(UserContext);
    console.log(ctx);
    let userId  = ctx?.user?.userId


    const navigate = useNavigate();

    let endPoint = 'https://socialmediabackend-abt5.onrender.com'
    let socketRef = useRef();
    const [messageBySocket, setMessageBySocket] = useState("");




    
    const [friend , setFriend] = useState("")
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState("");
    const messageContainerRef = useRef(null);
    const [isFriendSelected, setIsFriendSelected] = useState(false);
    // console.log(message);
    

    const followersArr =  ctx?.user?.loggedUserDetails?.followers || []
    const followingsArr =  ctx?.user?.loggedUserDetails?.followings || []
    const chatsArr = _.unionBy(followersArr, followingsArr, "_id");

    // const chatsArr = [...followersArr, ...followingsArr].reduce((acc,obj) => {
    //     const index = acc.findIndex((item) => item._id === obj._id);
    //     if (index === -1) {
    //         acc.push(obj);
    //     } 
    //     else{
    //         acc[index] = {...acc[index], ...obj }
    //     }
    //     return acc
    // }, []);

    // console.log(chatsArr);



    const handleSelectedFriend = async (user) => {
        navigate(`?friendId=${user?._id}`, {replace : true}); 
        let res  = await axios.get(`https://socialmediabackend-abt5.onrender.com/messages/getChats/${user?._id}`, {
            headers: {
                "Authorization": ctx.user.token
            }
        });
        let data = await res.data.findConversation.messages;
        const updatedData = data.map((message) => ({
                  ...message,
                  timeAgo: moment(message.createdAt).fromNow(),
                }));
        console.log(data);
        setConversation(updatedData);
        setFriend(user) 
    }

    const handleMessageChanger = (e) => {
       setMessage(e.target.value);
    }

    const handleSendMessage = async (friend) => {
        let friendId = friend?._id
        socketRef.current.emit("sendMessage", {friendId, userId, text: message})
        let obj = {
            text: message
         }  

       let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/messages/sendMessage/${friendId}`, obj, {
      headers : {
        "Authorization" : ctx?.user?.token
      }
       });
       let data = await res.data
       console.log(data);
       if (data.success) {
       
        handleSelectedFriend(friend);
        setMessage("");
       }
    }

    useEffect(() => {
        if (isFriendSelected) {
            return;
        }
        const params = new URLSearchParams(location.search);
        const friendId = params.get("friendId");
        if (friendId && chatsArr.length > 0) {
          const friend = chatsArr.find((u) => u._id === friendId);
          if (friend) {
            handleSelectedFriend(friend);
            setIsFriendSelected(true)
          } else {
            console.error("Friend not found in chatsArr");
          }
        }
    }, [chatsArr, isFriendSelected ]);

    useEffect(() => {
            if (messageContainerRef.current) {
              setTimeout(() => {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
              }, 0);
            }
    }, [conversation]);

    useEffect(()=>{
          socketRef.current = io(endPoint,{transports:['websocket']});
    
          socketRef.current.emit('addUser',userId);
    },[]);

    useEffect(() => {
         socketRef.current.on("getMessage", ({friendId, userId, text}) => {
          console.log({friendId, userId, text});
          setMessageBySocket({friendId, userId, text, timeAgo: moment(new Date()).fromNow()});
         });
    },[]);

    useEffect(() =>  {
          if (messageBySocket) {
            setConversation([
              ...conversation, 
              messageBySocket
            ])
          }
    }, [messageBySocket]);
    


  return (
    <div className='w-full gap-8 flex h-screen  mt-[-70px] overflow-hidden '>


        {/* Left */}
    
      <div className="w-[20%] border-y-2 border-black ml-2 mt-[60px] rounded-lg h-[88%] flex flex-col  items-center  border-x-[1px] overflow-y-auto scrollbar-hide">
        {chatsArr.length > 0 ? (
          chatsArr.map((user, index) => (
            <div key={index} className="px-3 bg-red-300 py-2 h-32 border-b-2 flex flex-col items-center w-full border-gray-300">
                <div onClick={() => handleSelectedFriend(user)}>
                <img
                src={user?.profilePic || 'https://via.placeholder.com/50'}
                alt={`${user?.name}'s profile`}
                className="w-12 h-12 cursor-pointer  rounded-full border-2 border-red-400"
              />
                </div>
            
                <div onClick={() => handleSelectedFriend(user)}>
                <p className="font-serif text-lg cursor-pointer">{user?.name || 'Unknown User'}</p>
                </div>
            </div>
          ))
        ) : (
            <div className='h-full flex  flex-col gap-6 items-center justify-center'>           
              <p className='font-serif shadow-md rounded-md text-gray-600 bg-red-100 '>
                No followers or followings to Chat
              </p>
              <TbFriendsOff size={70} fill='green' />
              <p className='font-serif shadow-md rounded-md text-gray-600 bg-green-50 '>
               Please Follow or Wait for Follow
              </p>
            </div>
        )
        }
      </div>



      {/* Middle */}

      {
        friend ? (
        <div style={{
            backgroundImage: `url(${friend?.coverPic})`,
            opacity: 0.8
          }} className='flex bg-cover flex-col h-full relative w-[55%] border rounded-lg py-13'>
    
          <header className='flex h-[35px] justify-between items-center p-4 bg-blue-100 fixed w-[55%] top-[55px]  right-17 z-10'>
          <div className='flex gap-1 items-center'>
            <img src={friend?.profilePic} alt='Avatar' className='w-7 h-7 object-cover rounded-full' />
            <span className='ml-2 font-serif capitalize'>{friend?.name}</span>
          </div>
          <div className='flex gap-5 items-center'>
            <MdCall size={20} className='text-lg mr-2 cursor-pointer' />
            <MdVideoCall size={24} className='text-lg mr-2 cursor-pointer' />
            <FaRegSmile size={20} className='text-lg cursor-pointer' />
          </div>
          </header>
    
          <div ref={messageContainerRef} className='flex-1  overflow-y-auto scrollbar-hide px-4 mt-[90px] pb-7'>
          {conversation.map((ele, index) => {
           return  <div key={index} className={`flex ${ele?.userId?._id === ctx.user.userId ? 'justify-end' : ''} `}> 
              <div className={`inline-block p-2 rounded-lg ${ele?.userId?._id === ctx.user.userId ? 'bg-blue-200' : 'bg-green-200'} mb-4 max-w-[45%] break-words`}> 
                <p className='font-serif'>
                  {ele?.text}
                  <p className='text-xs flex justify-end mt-[-5px]'>{ele?.timeAgo}</p>
                  </p> 
               
                {/* <small className='block text-right text-xs text-gray-500'>{timestamp}</small>  */}
              </div>
              
              <img className='w-6 ml-[2px] border-[1px] border-red-600 h-6 rounded-full' src={ele?.userId?.profilePic ? ele.userId.profilePic : friend.profilePic} alt="" /> 
                
             
              
            </div> 
    })}
          </div>
    
    
          <div className='pr-4 pl-1 py-2 h-[40px] rounded-lg flex items-center  fixed w-[55%] right-17 bottom-0 z-10'>
          <input value={message} onChange={handleMessageChanger} name='message' type='text'  placeholder='Type your message here...' className='flex-1  p-2 border-[1px] border-gray-300 rounded-lg text-center focus:outline-none' />
          <button onClick={() => handleSendMessage(friend)} className='ml-2 p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center'> 
            <MdSend /> 
          </button>
          </div>
    
          </div>
            ) : (
                <div className="flex w-[55%] flex-col items-center justify-center h-[85%] text-gray-600 bg-gray-200 rounded-lg p-8 mt-[70px] mb-4 shadow-lg">
                {/* Icon or Illustration */}
                <FaUserFriends size={100} className="text-gray-400 mb-4" />
          
                {/* Message */}
                <h2 className="text-2xl font-semibold mb-2">No Friend Selected</h2>
                <p className="text-center text-gray-500 mb-4">
                  Choose a friend from the list to start a conversation.
                </p>
          
                {/* Optional Call to Action */}
                <div className="text-center">
                  <p className="text-gray-600">Don’t see your friends?</p>
                  <button
                    onClick={() => toast.error('Invite friends functionality coming soon!', {position: "top-center", theme: "colored"})}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Invite Friends
                  </button>
                </div>
              </div>
                 )
      }


      {/* Right */}

      {
           friend ? ( <div className='w-[20%] relative h-full mr-3'>
        <div className='absolute top-20 bg-  flex items-center flex-col gap-3 w-full bg-yellow-50 rounded-lg border-[3px] h-[50%] border-black shadow-lg'>
             <img src={friend?.profilePic} className='w-24 mt-4 h-24 rounded-full border-[1px] border-red-500' alt="" />
             <h2 className='font-serif capitalize text-lg'>{friend?.name}</h2>
             <Link state={friend?._id} to={`/friendProfile?name=${friend?.name}`} className='border-[1px] shadow-lg cursor-pointer hover:bg-green-600 hover:text-white border-black bg-green-400 px-2 py-1 rounded-lg'>
                   View Profile
             </Link>
        </div>
           </div>) : (
           <div className="flex w-[20%] flex-col items-center bg-gray-200 text-gray-600 rounded-lg shadow-lg p-6 h-[50%] mr-3 mt-[70px]">
           {/* Profile Picture */}
           <FaUserFriends size={80}
             className="text-gray-400 "
           />
           
           {/* Name */}
           <h2 className="mt-4 text-xl font-semibold text-gray-700">No Friend Selected</h2>
           
         
           
           {/* Action Buttons */}
           <div className=" mt-4">
             <button onClick={() => toast.error("Please select Friend to start Chat !!", {position: "top-center", theme: "colored"})} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
               No Profile
             </button>
           </div>
         </div>
           )
      }
   

   </div>
  
  )
}

export default Chats;
