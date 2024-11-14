import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutRoute } from "../../utils/APIroutes.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../utils/ToastCss.js";
import { getAllRooms, logout } from "../../utils/Api.post.js";
import { Card } from "../../components/Card/Card.jsx";
import styles from "./Home.module.css";
import { CreateRoom } from "../../components/createRoom/CreateRoom.jsx";
import { useDispatch } from "react-redux";
import { unsetAuth } from "../../store/authSlice.js";
import Navbar from "../../components/navbar/Navbar.jsx";
import { JoinRoom } from "../../components/joinRoom/JoinRoom.jsx";
import searchIcon from "../../assets/search.png";
export const Home = () => {
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState({
        search: "",
    });
    const [result, setResult] = useState(rooms);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const leaving = location.state.leaving;
    const fetchRooms = async () => {
        const { data } = await getAllRooms();
        console.log(data.rooms);
        setRooms(data.rooms);
        setResult(data.rooms);
    };

    useEffect(() => {
        fetchRooms();

        if (leaving) {
            setTimeout(() => {
                fetchRooms();
            }, 1000);
        }
    }, []);
    const search = () => {
        var toSearch = rooms;
        if (filter.search === "") setResult(rooms);
        else {
            toSearch = toSearch.filter((rooms) => {
                return rooms.title === filter.search;
            });
            setResult(toSearch);
        }
        console.log(result);
    };

    const handleChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
        console.log(filter);
    };
    const onLogout = async () => {
        const { data } = await logout();
        if (data.status === false) {
            toast.error(data.msg, toastOptions);
            console.log(data.error);
        } else {
            toast(data.msg);
            dispatch(unsetAuth());
            navigate("/");
        }
    };
    const handleCreateOnclick = () => {
        setShowCreate(true);
    };
    const handleJoinOnclick = () => {
        setShowJoin(true);
    };
    return (
        <>
            <Navbar logout={onLogout}></Navbar>

            <div className={styles.bg}>
                <div className={styles.topContainer}>
                    <div className={styles.searchBox}>
                        <input
                            className={styles.search}
                            placeholder="Search"
                            name="search"
                            onChange={(e) => handleChange(e)}
                        ></input>
                        <img
                            src={searchIcon}
                            className={styles.searchSubmit}
                            onClick={search}
                        ></img>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.create} onClick={handleCreateOnclick}>
                            Create new Room{" "}
                        </button>
                        <button className={styles.join} onClick={handleJoinOnclick}>
                            Join Private Room
                        </button>
                    </div>
                </div>
                <div className={styles.roomList}>
                    {result.length !== 0 ?
                        
                            result.map((room) => (
                                <Card key={room._id} room={room}></Card>
                            ))
                         :<div className={styles.emptyContainer}> <div className={styles.empty}>No room to join, Create new room to connect with peers.</div> </div>}
                </div>
                <ToastContainer />
            </div>
            {showCreate && (
                <CreateRoom
                    onrefresh={() => fetchRooms()}
                    onClose={() => setShowCreate(false)}
                />
            )}
            {showJoin && (
                <JoinRoom
                    onrefresh={() => fetchRooms()}
                    onClose={() => setShowJoin(false)}
                />
            )}
        </>
    );
};
