import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const SignUp = () => {

  const navigate = useNavigate()
  const [input, setInput] = useState(
    {
      name: "",
      email: "",
      password: ""
    }
  );
// console.log(input);


  const handleInputChanger = (e) => {
    let value = e.target.value;

    let name = e.target.name;

    // console.log(value)
    // console.log(name)

    setInput({
      ...input, 
      [name]: value
    })
  }



  const handleClick =async (e) => {
    e.preventDefault();
    // console.log(input);


   let res = await fetch("https://socialmediabackend-abt5.onrender.com/users/create", {
    method: "POST", 
    headers: {
     "Content-type": "application/json"
    }, 
    body: JSON.stringify(input)
   })


   let data = await res.json();

  //  console.log(data);

   if (data.success) {

       toast.success(data.msg, {position: "top-right", theme: "colored"})
       navigate("/signin");
   } 

   else{
        toast.error(data.msg, {position: "top-right", theme: "colored"})
   }
  }



  return (
    <div className='flex justify-center items-center mt-16 md:mt-0'>
<div className="flex border mt-8 bg-gray-100 w-fit rounded-xl h-4/6  flex-col justify-center px-6 py-2 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm h-22">
    <img className="mx-auto h-16 w-auto" src="https://res.cloudinary.com/dqo56owj9/image/upload/v1735624119/xdrw7mmzpodjxoly2vaq.png" alt="Your Company" />
    <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-red-600">Sign up to your account</h2>
  </div>
  <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-1" action="">
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Name</label>
        <div className="mt-1">
          <input onChange={handleInputChanger} type="text" name="name" id="name" autoComplete="name" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div className="mt-1">
          <input onChange={handleInputChanger} type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
        </div>
        <div className="mt-2">
          <input onChange={handleInputChanger} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2  sm:text-sm/6" />
        </div>
      </div>
      <div>
        <button  onClick={handleClick} type="submit" className="flex mt-3
         w-full justify-center  rounded-md bg-gradient-to-r from-red-400 via-blue-400 to-green-400 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ">Sign up</button>
      </div>
    </form>
    <p className="mt-1 text-center text-sm/6 text-gray-500">
      Already a member?
      <Link to={"/signin"} className="font-semibold text-indigo-600 hover:text-indigo-500">Proceed to Login here</Link>
    </p>
  </div>
</div>


</div>

  )
}

export default SignUp;
