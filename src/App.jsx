import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import { useContext } from 'react'
import UserContext from './context/UserContext'
import ForgetPassword from './pages/ForgetPassword'
import ProfilePage from './pages/ProfilePage'
import UserPosts from './pages/UserPosts'
import FriendProfilePage from './pages/FriendProfilePage'
import FriendChat from './pages/FriendChat'
import PostPage from './pages/PostPage'
import Chats from './pages/Chats'

function App() {

let ctx  = useContext(UserContext);

// console.log(ctx)

let login = ctx.user.login;
// console.log(login)

  return (
    <>

      <BrowserRouter>


       <div className='mb-[70px]'>
          <Navbar />
       </div>
      
   
       <Routes> 

         <Route path='/' element={login === true ? <Home /> : <Navigate to={"/signin"} />}/>
         <Route path='/signin' element={login === false ? <SignIn /> : <Navigate to={"/"} />}/>
         <Route path='/signup' element={login === false ? <SignUp /> : <Navigate to={"/"} />}/>
         <Route path='/forgetPassword' element={login === false ? <ForgetPassword /> : <Navigate to={"/"} />} />

         <Route path='/profilePage' element={login === true ? <ProfilePage /> : <Navigate to={"/signin"} />} />

         <Route path={`/posts`} element={login === true ?  <UserPosts /> : <Navigate to={"/signin"} />} />

         <Route path={`/friendProfile`} element={login === true ? <FriendProfilePage /> : <Navigate to={"/signin"} /> } />

         <Route path={`/friendProfile/friendChat`} element={login === true ? <FriendChat /> : <Navigate to={"/signin"} />} />

         <Route path={`/post`} element={login === true ? <PostPage /> : <Navigate to={"/signin"} />} />

         <Route path={`/Chats`} element={login === true ? <Chats /> : <Navigate to={"/signin"} />} />
       </Routes>
      


       <ToastContainer  autoClose={2000} pauseOnHover={false} />


      </BrowserRouter>

      
    </>
  )
}

export default App;
