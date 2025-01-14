import React, { useContext, useState } from 'react';
import { Button, Modal } from 'antd';
import { FiUpload } from "react-icons/fi"; 
import "./customStyles.css"; // Import your CSS file
import UserContext from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostButton = (props) => {

  let ctx = useContext(UserContext);
  // console.log(ctx)

  const [image, setImage] = useState(false);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
 

  const [details, setDetails] = useState({
    title: "",
    description: "",
    file: "",
  });



  const handleSubmitPost = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 2000);




    let res = await axios.post("https://socialmediabackend-abt5.onrender.com/posts/create", details, {
      headers: {
        "Authorization" : ctx.user.token
      }
    });

    let data = await res.data;
    // console.log(data)

    if (data.success) {
      toast.success(data.msg, {position: "top-left", theme: "colored"});
      setDetails({
        title: "", 
        description: "",
        file: ""
      })
      setOpen(false);
      props.getAllPosts();
    } 
    else {
      toast.error(data.msg, {position: "top-left", theme: "colored"})
    }
  };


  const handleCancel = () => {
    setOpen(false);
    setDetails({
      title: "",
      description: "", 
      file: ""
    })
  };


  const localCancel = () => {
    setOpen(false);
  }

  const handleClick = () => {
    // console.log("ok")
    setOpen(true);
  };

  const handleInputChange = (e) => {
    // e.preventDefault();
      setDetails({...details,
      [e.target.name]: e.target.value})
     
  };


  const handleFileChanger = async (e) => {
    setImage(true);
    let file = e.target.files[0];

    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("upload_preset", "akash_khare");



    try {
      let res = await fetch("https://api.cloudinary.com/v1_1/dqo56owj9/auto/upload",{
        method: "POST",
        body: formData
      });
  
      let data = await res.json();
      console.log(data.secure_url);

      if (data.secure_url) {
        setImage(false);
      }
  
      setDetails({
        ...details,
        file: data.secure_url
      })
    } catch (error) {
       console.log(error);
    }
   


    // let reader = new FileReader();
    // reader.readAsDataURL(file);


    // reader.onload = () => {
    //    setDetails({...details, 
    //     file: reader.result})
    // } 

    // reader.onerror = () => {
    //   console.log(reader.error)
    // }


  };

//  console.log(details);



return (<>

    <div className='w-full h-16 flex justify-evenly items-center'>
      <button onClick={handleClick} className='font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900  p-1 rounded-lg text-lg'>Share a Feeling 😎</button>
      <button onClick={handleClick} className='font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900  p-1 rounded-lg text-lg'>Create a Post 📤</button>
      <button onClick={handleClick} className='font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900  p-1 rounded-lg text-lg'>Photo/Video 🎥</button>
    </div>




    <Modal
       className="custom-modal"
       open={open}
       onOk={handleSubmitPost}
       onCancel={localCancel}
       footer={[
               <Button className='bg-red-500 left' key="back" onClick={handleCancel}>
    Cancel
               </Button>,
               <Button className='bg-green-400' key="submit" type="primary" loading={loading} onClick={handleSubmitPost}>
    Post
               </Button>
 
               ]}
    >




       <div className="min-h-full flex  justify-center mt-6">
      <div className="w-full max-w-lg shadow-md rounded-lg p-6">
        <form>
          {/* Title Field */}
          <div className="mb-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              onChange={handleInputChange}
              type="text"
              id="title"
              name="title"
              value={details.title}
              className="w-full border-gray-300 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500  focus:outline-none p-2"
              placeholder="Enter the title"
              required
            />
          </div>

          {/* Description Field */}
          <div className="mb-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              value={details.description}
              onChange={handleInputChange}
              id="description"
              name="description"
              className="w-full border border-gray-300 rounded-lg focus:outline-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              rows="4"
              placeholder="Enter the description"
              
            ></textarea>
          </div>

          {/* File Upload Field */}
          <div className="mb-2">


            <label
              htmlFor="file"
              className="flex text-xl font-medium  text-gray-700 mb-2"
            >
              <FiUpload className="text-xl mr-2 hover:cursor-pointer" />
              <span className="text-sm  hover:cursor-pointer">
                  {details.file ? "Uploaded Sucessfully" : "Click to Upload"}
                </span>
            </label>

            

            <input hidden
              onChange={handleFileChanger}
              type="file"
              id="file"
              name="file"
              className="w-full"
            />
            
          </div>


       
          {image ? (<div className='loader animate-spin rounded-full h-8 w-8 border-t-4 border-green-400 border-solid '></div>) : (
              details.file ? (details.file.includes("image") ? (
                <img className='w-full h-48 mx-auto rounded-lg object-contain' src={details.file} alt="" />
               ) : details.file.includes("video") ? (
                 <video controls className='w-full h-48 mx-auto rounded-lg object-cover' src={details.file}></video>
               ) : details.file.includes("audio") ? (
                 <audio className='w-full mx-auto h-10' controls src={details.file}></audio>
               ) : (
                <p className='text-red-400'>Unsupported file type!</p>
               )) : ("")
              
              ) 
           }
          
         
        </form>
      </div>
       </div>

    </Modal>

    

</>
  )
}

export default PostButton;
