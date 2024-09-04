import React, { useState } from 'react'
import { Form } from 'react-form-elements';
import { changeAvatar } from '../../utils/Api.post';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { avatarRoute } from '../../utils/APIroutes';
import { setAuth } from '../../store/authSlice';

const Avatar = () => {
    const dispatch=useDispatch();
    const user = useSelector((state)=>state.auth.user);
    const [avatar,setAvatar] = useState("");
    const handleChange =(e)=>{
        setAvatar(e.target.files[0]);
    }
    const handleSubmit=async()=>{
        const formData= new FormData();
        formData.append("avatar",avatar);
        formData.append("id", user.id);
        console.log(formData);
        const {data} = await axios.post(avatarRoute, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        if(data.status===false){
            console.log(data.msg);
        }
        else{
            console.log(data.msg);
            dispatch(setAuth(data));
        }
    }
  return (
    <>
    <div>
        <Form onSubmit={handleSubmit} encType='multipart/form-data' name='editAvatar'>
        <input type="file" onChange={handleChange}></input>
        <button type="submit">Submit</button>
    </Form>
    </div>
    </>
  )
}

export default Avatar