import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { MdSend, MdVideoCall, MdCall } from 'react-icons/md';
import { FaRegSmile } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";
import moment from 'moment';

const FriendChat = () => {

    let endPoint = 'https://socialmediabackend-abt5.onrender.com'

    const [conversation, setConversation] = useState([]);

    const [messageBySocket, setMessageBySocket] = useState("");

    let messageRef = useRef();

    let socketRef = useRef();

    const messageContainerRef = useRef(null);

    let ctx = useContext(UserContext);
    let token = ctx.user.token;
    let userId = ctx.user.userId;
    console.log(token);
  
    const location = useLocation();
    const friend = location.state;
    let friendId = friend._id;
    console.log(friendId);
    console.log(friend);

    const getChats = async () => {
        let res  = await axios.get(`https://socialmediabackend-abt5.onrender.com/messages/getChats/${friendId}`, {
            headers: {
                "Authorization": token
            }
        });

        let data = await res.data.findConversation.messages;
        const updatedData = data.map((message) => ({
                  ...message,
                  timeAgo: moment(message.createdAt).fromNow(),
                }));
        // console.log(data);
        setConversation(updatedData);

    }
    console.log(conversation);

    const handleSendMessage = async () => {
      socketRef.current.emit("sendMessage", {friendId, userId, text: messageRef.current.value})
        let obj = {
            text: messageRef.current.value
        }
        // console.log(obj);

        let res = await axios.post(`https://socialmediabackend-abt5.onrender.com/messages/sendMessage/${friendId}`, obj, {
            headers: {
                "Authorization": token
            }
        });

        let data = await res.data;
        console.log(data);

        if (data.success) {
            messageRef.current.value = ""
            getChats();
        }
        else {
            toast.error(data.msg, {position: "top-center", theme: "colored"})
        }
    }

    useEffect(() => {
      getChats();
    }, [])

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
    <div style={{
        backgroundImage: `url(${friend?.coverPic})`,
        opacity: 0.8
      }} className='flex bg-cover flex-col h-screen relative w-full mx-auto border rounded-lg py-13 mt-[-80px]'>

      <header className='flex h-[35px] justify-between items-center p-4 bg-blue-100 fixed lg:top-[55px] top-[60px] md:top-[50px]   left-0 right-0 z-10'>
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

      <div ref={messageContainerRef} className='flex-1 pb-4 overflow-y-auto scrollbar-hide px-4  mt-[140px]'>
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


      <div className='pr-4 pl-1 py-2 h-[45px] rounded-lg flex items-center  fixed bottom-0 left-0 right-0 z-10'>
      <input type='text' ref={messageRef}  placeholder='Type your message here...' className='flex-1 p-2 border-[1px] border-gray-300 rounded-lg text-center focus:outline-none' />
      <button onClick={handleSendMessage} className='ml-2 p-2 bg-blue-500 text-white rounded-lg flex items-center justify-center'> 
        <MdSend /> 
      </button>
      </div>

    </div>
  )
}

export default FriendChat;
