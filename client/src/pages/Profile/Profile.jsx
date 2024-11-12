import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../utils/Api.post";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { toastOptions } from '../../utils/ToastCss.js';

import {setAuth} from '../../store/authSlice.js'
const Profile = () => {
	const user = useSelector((state) => state.auth.user);
	const [newUser, setNewUser] = useState({
		username: user.username,
		password: null,
	});

  const dispatch=useDispatch();
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate("/avatar");
	};
	const handleChange = (e) => {
		setNewUser({ ...newUser, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		const { password } = newUser;

        console.log(newUser);
		const { data } = await updateUser({
			newUsername: newUser.username,
			username: user.username,
			password,
		});
		if (data.status === false) {
			toast.error(data.msg);
		}
		if (data.status === true) {
			toast(data.msg, toastOptions);
			dispatch(setAuth(data));
            setTimeout(()=>{
                navigate("/home")
            },1500);
            
		}
	};

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<div className={styles.subContainer}>
					<div className={styles.fieldContainer}>
						<div className={styles.field}>
							<div className={styles.header}>Change Username:</div>
							<input
								className={styles.Inp}
								onChange={handleChange}
                                name="username"
								placeholder="Enter new username"
							/>
						</div>

						<div className={styles.field}>
							<div className={styles.header}>Change Password:</div>
							<input
								className={styles.Inp}
								onChange={handleChange}
                                name="password"
								placeholder="Enter new Password"
							/>
						</div>
						<div className={styles.submitContainer}>
							<button className={styles.submit} onClick={handleSubmit}>
								Update Profile
							</button>
						</div>
					</div>
					<div className={styles.avatarField}>
						<div className={styles.header}>Change Profile Picture:</div>
						<button className={styles.avatar} onClick={handleNavigate}>
							Change Avatar
						</button>
					</div>
				</div>
			</div>
            <ToastContainer/>
		</>
	);
};

export default Profile;
