import React, { useContext, useState } from 'react'
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { IoChatboxEllipses } from 'react-icons/io5';

const UserFollowersFollowings = (props) => {

    let ctx = useContext(UserContext);
    
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingsOpen, setFollowingsOpen] = useState(false);
    

    const handleFollowersShow = () => {
       setFollowersOpen(true)
    }

    const handleFollowersCancel = () => {
        setFollowersOpen(false);
    }

    const handleFollowingsShow = () => {
        setFollowingsOpen(true);
    }

    const handleFollowingsCancel = () => {
        setFollowingsOpen(false);
    }



  return (
    <div className="mt-4 flex justify-center gap-4">

    <button onClick={handleFollowersShow} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-serif shadow hover:bg-blue-800">
      Followers <sup>{props?.userDetails?.followers?.length}</sup>
    </button>

    <button onClick={handleFollowingsShow} className="bg-green-400 text-gray-700 px-4 py-2 rounded-lg shadow font-serif hover:bg-green-700">
      Followings <sup>{props?.userDetails?.followings?.length}</sup>
    </button>


    {/* followers Modal  */}
             <Modal
           className="custom-modal"
           open={followersOpen}
           onOk={""}
           onCancel={handleFollowersCancel}
           footer={""}
        >
    
    
    <div className="min-h-full flex  justify-center mt-6">
          <div className="w-full max-h-[300px] scrollbar-hide overflow-y-auto flex items-center flex-col gap-4 max-w-lg shadow-md rounded-lg p-6 border-[1px] border-y-black">
                    {
                        props?.userDetails?.followers?.map((follower, index) => {
                            return <Link key={index} state={follower._id} to={`/friendProfile?name=${follower
                                .name
                            }`}  className='flex justify-between px-4 py-1 bg-slate-400 cursor-pointer hover:text-black rounded-lg w-full'>
                                <div className='flex gap-3'>
                                <img src={follower.profilePic} className='h-8 w-8 rounded-full border-[1px] border-red-600' alt="" />
                                <h4 className='font-serif mt-1'>{follower.name}</h4>
                                </div>
                               
                                <Link state={follower} to={`/friendProfile/friendChat?name=${follower.name}`}>
                                             <IoChatboxEllipses className='cursor-pointer hover:fill-green-500 mt-1' size={20} fill='green' />
                                </Link>
                               
                            </Link>
                        })
                    }
          
          </ div>
    </ div>
    
    
             </Modal>



     {/* Followings Modal */}
     <Modal
           className="custom-modal"
           open={followingsOpen}
           onOk={""}
           onCancel={handleFollowingsCancel}
           footer={""}
        >
    
    
    <div className="min-h-full flex  justify-center mt-6">
          <div className="w-full max-h-[300px] scrollbar-hide overflow-y-auto flex items-center flex-col gap-4 max-w-lg shadow-md rounded-lg p-6 border-[1px] border-y-black">
                    {
                        props?.userDetails?.followings?.map((following, index) => {
                            return <Link key={index} state={following?._id} to={`/friendProfile?name=${following.name}`}  className='flex justify-between px-4 py-1 bg-slate-400 w-full hover:text-black cursor-pointer rounded-lg  ]'>
                                <div className='flex gap-3'>
                                <img src={following?.profilePic} className='h-8 w-8 rounded-full border-[1px] border-red-600' alt="" />
                                <h4 className='font-serif mt-1'>{following.name}</h4>
                                </div>
                             
                               <Link state={following} to={`/friendProfile/friendChat?name=${following.name}`}>
                                             <IoChatboxEllipses className='cursor-pointer hover:fill-green-500 mt-1' size={20} fill='green' />
                                </Link>
                            </Link>
                        })
                    }
          
          </ div>
    </ div>
    
    
             </Modal>


  </div>
  )
}

export default UserFollowersFollowings;