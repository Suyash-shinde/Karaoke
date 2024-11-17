import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { deleteRoom, getRoom } from "../../utils/Api.post";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";
import styles from "./RoomPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../../utils/ToastCss.js";
import player from "../../assets/player.jpg";
import mic from "../../assets/mic.png";
import mute from "../../assets/mute.png";
import phone from "../../assets/phone.png";
import f505 from "../../assets/505.mp3"
import Matsuri from "../../assets/Matsuri.mp3";
import test from "../../assets/test.mp3";
export const RoomPage = React.memo(() => {
    const location = useLocation();
    const room = location.state.room;
    const { id: roomId } = useParams();
    const user1 = useSelector((state) => state.auth.user);
    const [isMute, setIsMute] = useState(true);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const user = { ...user1, owner: user1.id === room.owner._id };
    const owner = location.state.isOwner;
    const { clients, provideRef, handleMute, addSongToQueue, playNextSong } =
        useWebRTC(roomId, user, owner);

    if (owner) {
        window.onbeforeunload = function() {
            return "Owner cannot refresh the page";
        };
    }
    console.log("owner: ", owner);
    const clickMute = () => {
        handleMute(isMute, user.id);
        setIsMute(!isMute);
    };
    const handleLeave = () => {
        if (owner) {
            alert("Owner is leaving the room. The room will be deleted");
        }
        navigate("/home", { state: { leaving: true } });
    };
    const handleShow = () => {
        setShow(!show);
    };
    const addSong = (songUrl) => {
        /// queueSong(songUrl);
        addSongToQueue(songUrl);
        toast("Song added to queue");
        console.log("here");
    };

    /*
    change user to have another field named isPlayer
    add music stream api to room page
    trial 1 : make an html for the audio source and call provideref for it in the src
    this will cause a change in the clients array and add it to the render
    make a dummy json having an id generated onspot and having a field isPlayer
    pass it in the provide ref
  
    trial 2: Have to call usewebrtc again, to add the music api to the list of clients, and change the 
    audio stream source to api and rest all should be the same, modify changes to useeffects.
    */

    if (!room) {
        return <div>Loading...</div>;
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>{room.title}</div>
            </div>
            <audio
                ref={(instance) => provideRef(instance, "audio-player")}
                //style={{ display: "none" }}  // Hide the audio element

                autoPlay
            ></audio>
            <div className={styles.layout}>
                {clients?.map((client) => {
                    return (
                        <div
                            key={client.id}
                            className={client.owner ? styles.owner : styles.client}
                        >
                            <img
                                src={client.avatar ? client.avatar : "https://res.cloudinary.com/dmcsfqgch/image/upload/v1731612281/rr7aq5ievbsnza9lhv0d.jpg"}
                                className={styles.img}
                            ></img>
                            <audio
                                ref={(instance) => provideRef(instance, client.id)}
                                autoPlay
                            ></audio>
                            <h4 className={styles.name}>{client.username}</h4>
                        </div>
                    );
                })}
            </div>
            <div className={styles.bottom}>
                <div className={styles.controls}>
                    <div className={styles.buttonContainer} onClick={clickMute}>
                        <img
                            src={isMute ? "https://res.cloudinary.com/dmcsfqgch/image/upload/v1731612281/gah4srnaq7sjv1hoysfv.png" : "https://res.cloudinary.com/dmcsfqgch/image/upload/v1731612281/b7elowdn09jdzhdtzcrn.png"}
                            className={styles.controlButtons}
                        ></img>
                    </div>
                    <div className={styles.buttonContainerEnd} onClick={handleLeave}>
                        <img
                            src={phone}
                            className={styles.controlButtons}
                        ></img>
                    </div>
                    {owner ? (
                        <div className={styles.songModal} onClick={handleShow}>
                            {" "}
                            Add Songs{" "}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <div className={styles.code}>Code:{room.code}</div>
            {!show ? (
                <div></div>
            ) : (
                <div className={styles.modalContainer}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.headingName}>Song List</div>
                            <div className={styles.closeModal} onClick={handleShow}>
                                X
                            </div>
                        </div>
                        <div className={styles.modalList}>
                            <div
                                className={styles.element}
                                onClick={() => {
                                    addSong('https://res.cloudinary.com/dmcsfqgch/video/upload/v1731863850/songs/gxuf5o0u2dtvnuvte4wl.mp3');
                                }}
                            >
                                505 - Arctic Monkeys
                            </div>
                            <div
                                className={styles.element}
                                onClick={() => {
                                    addSong('https://res.cloudinary.com/dmcsfqgch/video/upload/v1731863848/songs/sa49faxx58l82kmrrhkt.mp3');
                                }}
                            >
                                Matsuri - Fuji Kaze
                            </div>
                            <div
                                className={styles.element}
                                onClick={() => {
                                    addSong('https://res.cloudinary.com/dmcsfqgch/video/upload/v1731863847/songs/hr3kyyskjkmuz6yutbfi.mp3');
                                }}
                            >
                                Test
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
});
