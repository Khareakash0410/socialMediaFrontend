import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';

const SignIn = () => {

  const ctx = useContext(UserContext)

  // console.log(ctx)


  const emailRef = useRef();

  const passwordRef = useRef();

const handleClick = async (e) => {

  e.preventDefault();
  let obj = {
    email: emailRef.current.value,
    password: passwordRef.current.value,
  }

  // console.log(obj);

  // after , obj will automatically goes in req.body

  let res = await axios.post("https://socializerbackend.onrender.com/users/login", obj);


  let data = await res.data;

  // console.log(data)

  if (data.success) {
      
      ctx.addUser(data)
      toast.success(data.msg, {position: "top-right", theme: "colored"})
      
  } 
  else {
     toast.error(data.msg, {position: "top-right", theme: "colored"})
  }
}


  return (
    
    <div className='flex justify-center items-center mt-16 md:mt-0'>
    <div className="flex w mt-8 h-4/6 border rounded-xl flex-col bg-gray-100 justify-center px-6 py-2 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm h-22">
    <img className="mx-auto h-16 w-auto" src="https://res.cloudinary.com/dqo56owj9/image/upload/v1735624119/xdrw7mmzpodjxoly2vaq.png" alt="Your Company" />
    <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-red-600">Sign in to your account</h2>
  </div>
  <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
    <form className="space-y-2" action="#" method="POST">
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div className="mt-2">
          <input ref={emailRef} type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
          <div className="text-sm">
            <Link to={"/forgetPassword"} className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
          </div>
        </div>
        <div className="mt-2">
          <input ref={passwordRef} type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm/6" />
        </div>
      </div>
      <div>
        <button onClick={handleClick} type="submit" className="flex mt-3 w-full justify-center rounded-md bg-gradient-to-r from-red-400 via-blue-400 to-green-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Sign in</button>
      </div>
    </form>
    <p className="mt-3 text-center text-sm/6 text-gray-500">
      Not a member?
      <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">Proceed to Register here</Link>
    </p>
  </div>
</div>

</div>
  )
}

export default SignIn;
