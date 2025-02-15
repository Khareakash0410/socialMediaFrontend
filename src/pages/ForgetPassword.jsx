import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgetPassword = () => {

  const navigate = useNavigate();
  const [input, setInput] = useState({
        email : ""
  })



  const handleInputChanger = (e) => {
     const value = e.target.value;
     const name = e.target.name;


    //   console.log(name)
    //   console.log(value)
    setInput({
        ...input,
        [name] : value
    })
  }

  

  const handleClick = async (e) => {
    e.preventDefault();

    let res = await axios.post ("https://socializerbackend.onrender.com/users/forgetPassword", input)


    let data = await res.data;

    // console.log(data);

    if (data.success) {
      
      toast.success(data.msg, {position: "top-right", theme: "colored"})
      navigate("/signin")


    } 
    else {
        toast.error(data.msg, {position: "top-right", theme: "colored"})
    }

  }



  return (
   <div className='flex justify-center items-center px-6 md:px-0 mt-16 md:mt-0'>
    <div className="flex mt-16 w-fit h-4/6 border rounded-xl flex-col bg-gray-100 justify-center px-6 py-2 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm h-22">
    <img className="mx-auto h-16 w-auto" src="https://res.cloudinary.com/dqo56owj9/image/upload/v1735624119/xdrw7mmzpodjxoly2vaq.png" alt="Your Company" />
    <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-red-600">Fill the details to Change your password</h2>
  </div>
  <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-2" action="" method='POST'>
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div className="mt-2">
          <input onChange={handleInputChanger}  type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6" />
        </div>
      </div>
     
      <div>
        <button onClick={handleClick}  type="submit" className="flex mt-3 w-full justify-center rounded-md bg-gradient-to-r from-red-400 via-blue-400 to-green-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Submit</button>
      </div>
    </form>
    <p className="mt-3 text-center text-sm/6 text-gray-500">
      Remember Your password?
      <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">Proceed to Login here</Link>
    </p>
  </div>
</div>

</div>
  )

  
}

export default ForgetPassword;
