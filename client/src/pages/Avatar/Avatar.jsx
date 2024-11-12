import React, { useEffect, useState } from "react";
import { Form } from "react-form-elements";
import { changeAvatar } from "../../utils/Api.post";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { avatarRoute } from "../../utils/APIroutes";
import { setAuth } from "../../store/authSlice";
import styles from "./Avatar.module.css";
import Navbar from "../../components/navbar/Navbar";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';
import { useNavigate } from "react-router-dom";
const Avatar = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const [avatar, setAvatar] = useState("");
    const [preview,setPreview]=useState("");
    const navigate= useNavigate();
	const handleChange = (e) => {
		setAvatar(e.target.files[0]);
        if(e.target.files && e.target.files[0]){
            var reader = new FileReader();
            reader.onload = function (f){
                setPreview(f.target.result);
                }
                reader.readAsDataURL(e.target.files[0]);
        }
	};
    
	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("avatar", avatar);
		formData.append("id", user.id);
		console.log(formData);
		const { data } = await axios.post(avatarRoute, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		if (data.status === false) {
			console.log(data.msg);
		} else {
			toast(data.msg);
			dispatch(setAuth(data));
            setTimeout(()=>{
            navigate("/home", {state:{leaving:false}})},1500)

		}
	};
	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<div className={styles.subContainer}>
					<div className={styles.field}>
						<div className={styles.imageContainer}>
							<div className={styles.currentContainer}>
								<div className={styles.current}>
									<img src={user.avatar} className={styles.img}></img>
								</div>

								<div className={styles.text}> Current Avatar</div>
							</div>
							<div className={styles.currentContainer}>
								{preview!=="" ? (
									<div className={styles.current}>
										<img src={preview} className={styles.img}></img>
									</div>
								) : (
									<div className={styles.current} />
								)}

								<div className={styles.text}> New Avatar</div>
							</div>
						</div>
						<Form
							onSubmit={handleSubmit}
							encType="multipart/form-data"
							name="editAvatar"
                            className={styles.footer}
						>
								<label className={styles.input}>
									<input
										type="file"
										onChange={handleChange}
										className={styles.inputButton}
                                        name="avatar"
									></input>
									Upload Image
								</label>
								<button type="submit" className={styles.submit}>
									Submit
								</button>
						</Form>
					</div>
				</div>
			</div>
            <ToastContainer/>
		</>
	);
};

export default Avatar;
