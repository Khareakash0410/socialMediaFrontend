import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { FaCameraRetro } from "react-icons/fa";
import { IoCall, IoCameraReverse } from "react-icons/io5";
import { toast } from 'react-toastify';
import { FaPen } from "react-icons/fa";
import { Button, Modal } from 'antd';
import { AiTwotoneSetting } from "react-icons/ai";
import { IoMdMail } from "react-icons/io";
import UserFollowersFollowings from '../components/UserFollowersFollowings';

const ProfilePage = () => {

      const [setting, setSetting] = useState(false);


      const [image, setImage] = useState(false);


      const [coverImage, setCoverImage] = useState(false);


      const [name, setName] = useState({
        name: ""
      });


      const [bio, setBio] = useState({
        bio: ""
      })


      const [city, setCity] = useState({
        city: ""
      })


      const [password, setPassword] = useState({
       password: ""
      })


      const [contact, setContact] = useState({
        contact: ""
      })



      const [nameloading, setNameLoading] = useState(false);
      const [bioloading, setBioLoading] = useState(false);
      const [cityLoading, setCityLoading] = useState(false);
      const [passwordLoading, setPasswordLoading] = useState(false);
      const [contactLoading, setContactLoading] = useState(false);


    
      const [nameOpen, setNameOpen] = useState(false);
      const [bioOpen, setBioOpen] = useState(false);
      const [cityOpen, setCityOpen] = useState(false);
      const [passwordOpen, setPasswordOpen] = useState(false);
      const [contactOpen, setContactOpen] = useState(false);
      

    // token & userId from userState Store --------------------- 

    let ctx = useContext(UserContext);
    // console.log(ctx)
    let userId = ctx.user.userId;
    // console.log(userId)
    let token = ctx.user.token


    // for all User Details from database -------------

    const [userDetails, setUserDetails] = useState("");

    console.log(userDetails)





     //  get User Details -----------------
    const getUserDetails = async () => {

       let res = await axios.get("https://socialmediabackend-abt5.onrender.com/users/getUserDetails", {
        headers: {
          Authorization: token
        }
       });

       let data = await res.data;
       console.log(data);
       setUserDetails(data.data);
    }

 


     // for update profilePic 
    const handleProfileChanger = async (e) => {
      setImage(true);
      let file = e.target.files[0];
      // console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "akash_khare");

try {
  let res = await axios.post("https://api.cloudinary.com/v1_1/dqo56owj9/image/upload",formData);


  let data = await res.data.secure_url;

  console.log(data);

  if (data) {
    setImage(false);
    let res1 = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`,{
     method: "PUT",
     headers: {
      "Content-type": "application/json",
      "Authorization": token
     },
     body: JSON.stringify({
      profilePic: data
     }),
    })

    let data2 = await res1.json();
    console.log(data2);
    if (data2.success) {
        toast.success(data2.msg, {position: "top-center", theme: "colored"})
        getUserDetails();
        ctx.loginUserDetails();
    } 
    else {
      toast.error(data2.msg, {position: "top-center", theme: "colored"})
    }
    
  }

  else {
    toast.error("upload only image", {position: "top-center", theme: "colored"})
  }

}

catch (error) {
  console.log(error);
  toast.error("Failed to update profile Pic", {position: "top-center", theme: "colored"})
}
    
    }





    //  for update coverPic -------------------

    const handleCoverPicChanger = async (e) => {
      setCoverImage(true);
  let file = e.target.files[0];
  // console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "akash_khare");

try {
let res = await axios.post("https://api.cloudinary.com/v1_1/dqo56owj9/image/upload",formData);


let data = await res.data.secure_url;

console.log(data);

if (data) {
  setCoverImage(false);
let res1 = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`,{
 method: "PUT",
 headers: {
  "Content-type": "application/json",
  "Authorization": token
 },
 body: JSON.stringify({
  coverPic: data
 }),
})

let data2 = await res1.json();
console.log(data2);
if (data2.success) {
    toast.success(data2.msg, {position: "top-center", theme: "colored"})
    getUserDetails();
} 
else {

}

}

else {
toast.error("upload only image", {position: "top-center", theme: "colored"})
}

}

catch (error) {
console.log(error);
toast.error("Failed to update cover Pic", {position: "top-center", theme: "colored"})
}

    }



    // settign icons for password and contactNo-----------
    
    const handleSettingClick = () => {
      setSetting((prev) => !prev);
    }




    // for password Modal----------------------

    const handlePasswordCancel = () => {
      setPasswordOpen(false);
      setSetting(false);
    }

    const handlePasswordClearCancel = () => {
      setPasswordOpen(false);
      setPassword({
        password: ""
      });
      setSetting(false);
    }

    const handlePasswordClick =() => {
      setPasswordOpen(true);
    }

    const handlePasswordChangerEvent = (e) => {
       console.log(e.target.value);
       console.log(e.target.name);

       setPassword({
        ...password, 
        password: e.target.value
       })
    }

    const handlePasswordChange = async () => {

      if (!password.password.trim()) {
        return toast.error("Please enter your New Password", {position: "top-center", theme: "colored"})
      }

      setPasswordLoading(true);
      setTimeout(() => {
      setPasswordLoading(false);
      setPasswordOpen(false);
    }, 2000);


      try {
        let res = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(password)
        })

        let data = await res.json();
        console.log(data);

        if (data.success) {
           toast.success(data.msg, {position: "top-center", theme: "colored"});
           getUserDetails();
           setPassword({
            password: ""
           })
           setSetting(false);
           setTimeout(() => {
            ctx.removeUser();
           },2000)

        } 
        else {
          toast.error(data.msg, {position: "top-center", theme: "colored"});
        }
        
      } catch (error) {
         toast.error("Failed to update Passowrd", {position: "top-center", theme: "colored"})
      }
    }




    // for name modal ----------------------


    const handleNameCancel = () => {
      setNameOpen(false);
    }

    const handleNameClearCancel = () => {
      setNameOpen(false);
      setName({
        name: ""
      })
    }

    const handleNameClick = () => {
      setNameOpen(true);
    }

    const handleNameChangerEvent = (e) => {
      // e.preventDefault();
      let name = e.target.value
      // console.log(e.target.name)
      // console.log(name)
      setName({
        ...name,
        name: name
      })
    }

    const handleNameChange = async () => {

      if (!name.name.trim()) {
        return toast.error("Please enter your name", {position: "top-center", theme: "colored"});
       }


      setNameLoading(true);
      setTimeout(() => {
      setNameLoading(false);
      setNameOpen(false);
    }, 2000);


   

    try {
      let res = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(
          name
        )
      })
  
      let data = await res.json();
  
      console.log(data);

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"});
        getUserDetails();
        setName({
          name: ""
        })
      }

      else {
        toast.error(data.msg, {position: "top-center", theme: "colored"}) 
      }
  
    } catch (error) {
       console.log(error);
       toast.error("Failed to update user", {position: "top-center", theme: "colored"})
    }

    }

   

    //  for Contact modal----------------------

    const handleContactCancel = () => {
      setContactOpen(false);
    }

    const handleContactClearCancel = () => {
      setContactOpen(false);
      setContact({
        contact: ""
      })
    }

    const handleContactClick = () => {
      setContactOpen(true);
    }

    const handleContactChangerEvent = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);
          
        setContact({
            ...contact,
            contact: e.target.value
          })
        
        
    }

    const handleContactChange = async () => {
       if (!contact.contact.trim()) {
        return toast.error("Please Provide New Number", {position: "top-center", theme: "colored"})
       }

       if ( !/^\d*$/.test(contact.contact) || contact.contact.length !== 10) {
        return toast.error("Phone Number should be valid like 9876543210", {position: "top-center", theme: "colored"})
       }


       setContactLoading(true);
      setTimeout(() => {
      setContactLoading(false);
      setContactOpen(false);
    }, 2000);



    try {
      let res = await axios.put(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`,contact, {
        headers: {
          "Authorization" : token
        }
       })

       let data = await res.data;
       console.log(data);

       if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"});
        getUserDetails();
        setContact({
          contact: ""
        });
        setSetting(false);
       }
       else {
        toast.error(data.msg, {position: "top-center", theme: "colored"});
        }
    } catch (error) {
      toast.error("Failed to Update Phone Number", {position: "top-center", theme: "colored"})
    }


      


    }



      // for bio modal -------------------------

    const handleBioCancel = () => {
        setBioOpen(false);
    }

    const handleBioClearCancel = () => {
      setBioOpen(false);
      setBio({
        bio: ""
      })
    }

    const handleBioClick = () => {
      setBioOpen(true);
    }

    const handleBioChangerEvent = (e) => {
      let bio = e.target.value;
      // console.log(bio);
      // console.log(e.target.name);

      setBio({
        ...bio,
        bio: bio
      })
    }

    const handleBioChange = async () => {

      if (!bio.bio.trim()) {
        return toast.error("Please enter your Bio", {position: "top-center", theme: "colored"});
       }

      setBioLoading(true);
      setTimeout(() => {
      setBioLoading(false);
      setBioOpen(false);
    }, 2000);

    try {
      let res = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(
          bio
        )
      })
  
      let data = await res.json();
  
      console.log(data);

      if (data.success) {
        toast.success(data.msg, {position: "top-center", theme: "colored"});
        getUserDetails();
        setBio({
          bio: ""
        })
      }

      else {
        toast.error(data.msg, {position: "top-center", theme: "colored"}) 
      }
  
    } catch (error) {
       console.log(error);
       toast.error("Failed to update user", {position: "top-center", theme: "colored"})
    }


    }




    // for City Modal ---------------------

    const handleCityCancel = () => {
      setCityOpen(false);
    }

    const handleCityClearCancel = () => {
      setCityOpen(false);
      setCity({
        city: ""
      })
    }
   
    const handleCityClick = () => {
      setCityOpen(true);
    }

    const handleCityChangerEvent = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);

        setCity({
          ...city,
          city: e.target.value
        })
    }

    const handleCityChange = async () => {
       if (!city.city.trim()) {
        return toast.error("Please provide new City name", {position: "top-center", theme: "colored"});
       }

       setCityLoading(true);
      setTimeout(() => {
      setCityLoading(false);
      setCityOpen(false);
       }, 2000);

       try {
        let res = await fetch(`https://socialmediabackend-abt5.onrender.com/users/update/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(city)
         });
  
         let data = await res.json();
         console.log(data);
  
         if (data.success) {
           toast.success(data.msg, {position: "top-center", theme: "colored"});
           getUserDetails();
           setCity({
            city: ""
           });
           ctx.loginUserDetails();
         } 
         else {
           toast.error(data.msg, {position: "top-center", theme: "colored"})
         }
       } catch (error) {
         console.log(error);
         toast.error("Failed to update City", {position: "top-center", theme: "colored"});
       }

       
    }




    // useffect for User Details first visit in profile page on login 
    

     useEffect(() => {
  getUserDetails();
     } ,[])



  return (
              // Profile Page body ----------------
      <div className="min-h-screen flex mt-[-80px] flex-col items-center px-4 pt-24">



              {/* Profile Card Container */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-slate-300 via-red-50 to-yellow-50 rounded-lg shadow-lg overflow-hidden">



   {/* Cover Picture that includes profile picture and contact change, password change inside it */}
        <div className="relative w-full h-44">
          {
            coverImage ? (<div className='loader animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 border-solid '></div>) : ( <img
              src={userDetails?.coverPic} 
              alt="Cover"
              className="w-full h-full object-cover"
            />)
          }
         

               {/* for update cover pic */}
          <label className='absolute bottom-[0px] right-0 cursor-pointer' htmlFor="coverPic"><FaCameraRetro size={25} /></label>
          <input type="file" onChange={handleCoverPicChanger} hidden id='coverPic'/>


          
                 {/* Profile Picture */}
          <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2">
          {
            image ? (<div className='loader animate-spin rounded-full h-8 w-8 border-t-4 border-green-400 border-solid '></div>) : (<img src={userDetails?.profilePic} 
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-red-500 shadow-lg"
              />)
          }



              {/* for update profile Picture */}
          <label htmlFor="profilePic"><IoCameraReverse size={20} className='absolute cursor-pointer top-[42px] right-[-18px]' /></label>
          <input type="file" hidden id='profilePic' onChange={handleProfileChanger} />


             {/* for update password and Contact show dropdown */}
         <AiTwotoneSetting size={20} onClick={handleSettingClick} className='absolute cursor-pointer top-[46px] right-[-400px]' />

         { 
         setting && (
              <div className="absolute right-[-400px] top-[66px] w-40 bg-yellow-50 border border-black rounded shadow-lg">

                          {/* Password  */}
        <p onClick={handlePasswordClick} className="font-serif block text-center px-4 py-2 text-gray-700 cursor-pointer hover:bg-slate-200">Change Password</p>


                         {/* Password Modal */}

           <Modal
       className="custom-modal"
       open={passwordOpen}
       onOk={handlePasswordChange}
       onCancel={handlePasswordCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handlePasswordClearCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={passwordLoading} onClick={handlePasswordChange}>
    OK
               </Button>
 
               ]}
    >


<div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Name Field */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Your New Password
            </label>
            <input
              value={password.password}
              onChange={handlePasswordChangerEvent}
              type="password"
              id="password"
              name="password"
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the New Password"
              required
            />
          </div>

          </ form>

      </ div>
</ div>


           </Modal>



                           {/* Contact */}
        <p onClick={handleContactClick} className="font-serif block text-center px-4 py-2 text-gray-700 cursor-pointer hover:bg-slate-200">Change Contact</p>


                        {/* Contact Modal */}
        

           <Modal
       className="custom-modal"
       open={contactOpen}
       onOk={handleContactChange}
       onCancel={handleContactCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handleContactClearCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={contactLoading} onClick={handleContactChange}>
    OK
               </Button>
 
               ]}
    >


<div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Contact Field */}
          <div className="mb-2">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Your New Phone
            </label>
            <input
              value={contact.contact}
              onChange={handleContactChangerEvent}
              type="text"
              id="contact"
              name="contact"
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the New Phone Number"
              required
            />
          </div>

          </ form>

      </ div>
</ div>


           </Modal>
                        





              </div>
                    ) 
         }
          

          
            
          </div>
        </div>






                 {/* User Details Section */}
      <div className="pt-16 pb-6 px-4 text-center">


                      {/* Name */}
          <div className='flex justify-center items-center gap-1'>
             <h1 className="text-2xl font-bold text-gray-800">   {userDetails?.name}
             </h1>
             <FaPen className='cursor-pointer'  onClick={handleNameClick} size={10} />
          </div>



                    {/* Name Modal */}
         <Modal
       className="custom-modal"
       open={nameOpen}
       onOk={handleNameChange}
       onCancel={handleNameCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handleNameClearCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={nameloading} onClick={handleNameChange}>
    OK
               </Button>
 
               ]}
    >


<div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Name Field */}
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              value={name.name}
              onChange={handleNameChangerEvent}
              type="text"
              id="name"
              name="name"
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the New name"
              required
            />
          </div>

          </ form>

      </ div>
</ div>


         </Modal>



          
                     {/* email & Contact */}
          <div className='flex justify-center items-center'>
            <h4 className='font-serif cursor-not-allowed text-sm text-gray-600'>
              {userDetails?.email}
            </h4>
            <IoMdMail color='red' size={10} className='mr-2 cursor-not-allowed'/>
             | 
            <h4 className='font-serif ml-2 cursor-grab  text-sm text-gray-600'>+91-{userDetails?.contact}
            </h4>  
            <IoCall color='green' size={12} className=' cursor-grab' />
          </div>



                       {/* City */}
          <div className='flex justify-center items-center gap-1'>
            <h2 className='font-serif  text-2xl  mb-1'>
              {userDetails?.city}
            </h2>
            <FaPen onClick={handleCityClick} className='cursor-pointer' size={10} />   
          </div>




                        {/* City Modal */}
          <Modal
       className="custom-modal"
       open={cityOpen}
       onOk={handleCityChange}
       onCancel={handleCityCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handleCityClearCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={cityLoading} onClick={handleCityChange}>
    OK
               </Button>
 
               ]}
    >


<div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Title Field */}
          <div className="mb-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter the New City
            </label>
            <input
              value={city.city}
              onChange={handleCityChangerEvent}
              type="text"
              id="city"
              name="city"
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the New City Name"
              required
            />
          </div>

          </ form>

      </ div>
</ div>


          </Modal>



                       {/* Bio */}
          <div className='flex gap-1 justify-center items-center'>
               <p className="text-gray font-serif font-600 mt-2">
                     {
                      userDetails?.bio
                     }
               </p>
                <FaPen className='cursor-pointer mt-2' onClick={handleBioClick} size={10} />
          </div>
          

                     {/* bio modal */}
          <Modal
       className="custom-modal"
       open={bioOpen}
       onOk={handleBioChange}
       onCancel={handleBioCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handleBioClearCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={bioloading} onClick={handleBioChange}>
    OK
               </Button>
 
               ]}
    >


<div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Title Field */}
          <div className="mb-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Provide a Bio for Yourself
            </label>
            <input
              value={bio.bio}
              onChange={handleBioChangerEvent}
              type="text"
              id="bio"
              name="bio"
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the New Bio"
              required
            />
          </div>

          </ form>

      </ div>
</ div>


          </Modal>




                  {/* Action Buttons */}
          <UserFollowersFollowings userDetails= {userDetails}/>


      </div>

              
      </div>



      </div>
  )
}

export default ProfilePage;
