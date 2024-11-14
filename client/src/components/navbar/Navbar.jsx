import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/karaless.png";
const Navbar = ({ logout }) => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const [show, setShow] = useState(false);
	const dropDown = () => {
		setShow(!show);
	};
	const img = user.avatar;
	console.log(user);
	useEffect(() => {
		if (user.isAuth === false) navigate("/");
	}, []);
	return (
		<>
			<nav className={styles.container}>
				<img
					src={logo}
					onClick={() => {
						navigate("/home", {state:{leaving:false}});
					}}
					className={styles.menu}
				></img>
				<div className={styles.dropContainer}>
					<div className={styles.drop}>
						<div className={styles.imgContainer}>
							<img src={img} className={styles.pfp} onClick={dropDown}></img>
						</div>
						<div
							className={styles.dropdown}
							id="dropdown"
							style={show ? { display: "block" } : { display: "none" }}
						>
							<div className={styles.username}>{user.username}</div>

							<div className={styles.elements} onClick={()=>{navigate("/profile")}}>Update Profile</div>

							<div className={styles.logoutContainer}>
								<div className={styles.logout} onClick={logout}>Logout</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.logoutContainer}>
					
				</div>
			</nav>
		</>
	);
};

export default Navbar;
