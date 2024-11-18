import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../utils/ACTIONS";
import freeice from "freeice";
import { useNavigate } from "react-router-dom";
import { deleteRoom } from "../utils/Api.post";
export const useWebRTC = (roomId, user, owner) => {
	const [clients, setClients] = useStateWithCallback([]);
	const audioElements = useRef({});
	const connections = useRef({});
	const socket = useRef(null);
	const audioSocket = useRef(null);
	const localMediaStream = useRef(null);
	const audioContext = useRef(new AudioContext());
	const audioElement = useRef(new Audio());
	const audioStream = useRef(null);
	const clientsRef = useRef(null);
	const [songQueue, setSongQueue] = useState([]);
	const navigate = useNavigate();
	const player = { id: "audioplayer", username: "audio-player", avatar: null };
	useEffect(() => {
		console.log("render socketInit", 2);
		socket.current = socketInit();
		if (owner) {
			setTimeout(() => {
				audioSocket.current = socketInit();
			}, 1000);
		}
	}, []);
	console.log("owner", owner);

	const addSongToQueue = (song) => {
		// Initialize and play the song if no other song is playing
		if (
			(audioElement.current.paused ||
				audioStream.current.paused ||
				audioStream.current.ended) &&
			songQueue.length === 0
		) {
			setTimeout(() => {
				console.log("calling playnextsong()", songQueue);
				playNextSong({ song, first: true });
			}, 1000);
		} else {
			setSongQueue((prevQueue) => [...prevQueue, song]);
			console.log("Adding song to queue");
		}
	};

	const stopAudioStream = () => {
		if (audioStream.current || audioElement.current) {
			audioElement.current.pause();
			audioElement.current.src = "";
		}
	};
	const playNextSong = ({ song, first }) => {
		console.log("playnextsong called", song);

		console.log("inside if", songQueue);
		const nextSongUrl = song;
		audioElement.current.src = nextSongUrl; // Load the new song URL
		createAudioStream();
		audioElement.current
			.play()
			.then(() => {
				console.log("Playing song:", nextSongUrl);
				if (!first) {
					setSongQueue((prevQueue) => prevQueue.slice(1));
				}
			})
			.catch((err) => console.error("Audio play error:", err));

		// Remove the song from the queue after it starts playing

		// Set up onended event to automatically play the next song
		audioElement.current.onended = () => {
			if (songQueue.length > 0) {
				playNextSong({ song: songQueue[0], first: false });
			}
		};
	};
	audioElement.current.onended = () => {
		if (songQueue.length > 0) {
			playNextSong({ song: songQueue[0], first: false });
		}
	};
	audioElement.current.onerror = (e) => {
		console.error("Audio load error:", e);
	};

	audioElement.current.addEventListener("canplaythrough", () => {
		audioElement.current.play();
	});

	const createAudioStream = () => {
		// Create MediaStream from the audio element if it hasn’t been initialized

		audioElement.current.crossOrigin = "anonymous";

		if (!audioStream.current) {
			const source = audioContext.current.createMediaElementSource(
				audioElement.current,
			);
			const destination = audioContext.current.createMediaStreamDestination();
			source.connect(destination);
			source.connect(audioContext.current.destination);
			audioStream.current = destination.stream;
			audioElement.current.pause();

			console.log("Audio stream created");
		}
	};

	const addNewClient = useCallback(
		(newClient, cb) => {
			const lookingFor = clients.find((client) => client.id === newClient.id);

			if (lookingFor === undefined) {
				setClients((existingClients) => [...existingClients, newClient], cb);
			}
		},
		[clients, setClients],
	);
	const handleForceLeave = () => {
		console.log("Owner has disconnected. Disconnecting all clients...");

		clients.forEach((client) => {
			client.peerConnection.close();
		});
		setClients([]);
		alert("The room has been closed by the owner.");

		setTimeout(() => {
			navigate("/home", { state: { leaving: true } });
		}, 500);
	};
	useEffect(() => {
		socket.current.on(ACTIONS.FORCE_LEAVE, handleForceLeave);
		return () => {
			socket.current.off(ACTIONS.FORCE_LEAVE, handleForceLeave);
		};
	}, []);

	useEffect(() => {
		console.log("render clientsRef.current = clients", 3);
		clientsRef.current = clients;
	}, [clients]);
	useEffect(() => {
		console.log("render startCapture", 4);

		const startCapture = async () => {
			try {
				// Start capturing local audio stream.
				localMediaStream.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				if (owner) {
					createAudioStream(); // Function to create the audio stream for the owner.
				}
			} catch (error) {
				console.error("Error capturing audio stream:", error);
				return;
			}
		};

		const emitJoin = () => {
			console.log("Emitting join actions");
			socket.current.emit(ACTIONS.JOIN, {
				roomId,
				user,
				isOwner: owner,
			});
			if (owner === true) {
				setTimeout(() => {
					audioSocket.current.emit(ACTIONS.JOIN, { roomId, user: player });
				}, 1000);
			}
		};
		const finalizeJoin = () => {
			console.log("render startCapture then", 5);
			// Add current user to clients list
			addNewClient({ ...user, muted: true }, () => {
				console.log("render add new client me", 6, typeof user.id);
				const localElement = audioElements.current[user.id];
				if (localElement) {
					localElement.volume = 1;
					localElement.srcObject = localMediaStream.current;
				}
			});

			if (owner === true) {
				console.log("Owner confirmed, adding player after delay");
				setTimeout(() => {
					addNewClient({ ...player, muted: false }, () => {
						console.log("add new client player", player.id);
						// Additional setup for player
						const playerElement = audioElements.current["audio-player"];
						console.log("playerElement: ", playerElement);
						if (playerElement) {
							playerElement.volume = 1;
							playerElement.srcObject = audioStream.current;
							console.log("inside player element");
							console.log("addclients audioElements:", audioElements);
						}
					});
				}, 1000); // Adjust delay as needed
				emitJoin();
			} else {
				emitJoin();
			}
		};
		startCapture().then(finalizeJoin()); // Leaving the room
		return () => {
			if (localMediaStream.current) {
				localMediaStream.current.getTracks().forEach((track) => track.stop());
			}
			socket.current.emit(ACTIONS.LEAVE, { roomId });
			if (audioStream.current) {
				audioStream.current.getTracks().forEach((track) => track.stop());
				stopAudioStream();
				audioSocket.current.emit(ACTIONS.LEAVE, { roomId });
			}
			if (owner) {
				deleteRoom({ roomId });
			}
		};
	}, []);

	async function checkPermissionsAndReload() {
		try {
			// Attempt to access media devices
			await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

			// If successful, continue with WebRTC connection setup
			// Optionally, add additional connection logic here if needed
		} catch (error) {
			console.warn("Permissions not granted, attempting reload...");

			// Retry setup after permissions are given by reloading the page
			if (error.name === "NotAllowedError") {
				window.location.reload();
			}
		}
	}

	useEffect(() => {
		// Trigger permission check and reload if necessary
		checkPermissionsAndReload();
	}, []);

	// Handle new peer
	useEffect(() => {
		console.log("render handle new peer useEffect", 8);
		const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
			// If already connected then prevent connecting again
			console.log("Connections: ", connections.current);
			console.log("render inside handle new peer", remoteUser);
			console.log("peerID", peerId);
			if (peerId in connections.current) {
				return console.warn(
					`You are already connected with ${peerId} (${user.name})`,
				);
			}

			// Store it to connections
			const iceServers = [
				...freeice(),
				{
					urls: "turn:relay1.expressturn.com:3478",
					username: "efRP4CLC6TNZZ0JZ74",
					credential: "1N0fOLTsrfVihnyN",
				},
			];
			connections.current[peerId] = new RTCPeerConnection({
				iceServers,
			});

			console.log("RTCPeerConnection created:", connections.current[peerId]);
			// Handle new ice candidate on this peer connection
			connections.current[peerId].onicecandidate = (event) => {
				console.log("onice");
				socket.current.emit(ACTIONS.RELAY_ICE, {
					peerId,
					icecandidate: event.candidate,
				});
			};

			// Handle on track event on this connection
			connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
				// Check if remoteUser is defined before proceeding
				if (!remoteUser || !remoteUser.id) {
					console.error("remoteUser or remoteUser.id is undefined", remoteUser);
					return; // Exit the function if remoteUser is not defined
				}
				console.log("Inside ontrack");
				// Proceed to add the new client if remoteUser is defined
				addNewClient({ ...remoteUser, muted: true }, () => {
					console.log(
						"render add new client remote",
						9,
						"for user:",
						remoteUser.id,
					);
					console.log("audioElements: ", audioElements.current);
					if (remoteUser.id === "audioplayer") {
						if (audioElements.current["audio-player"]) {
							audioElements.current["audio-player"].srcObject = remoteStream;
							console.log("remoteStream 1", remoteStream);
						} else {
							let settled = false;
							const interval = setInterval(() => {
								if (audioElements.current["audio-player"]) {
									audioElements.current["audio-player"].srcObject =
										remoteStream;
									console.log("remoteStream 2", remoteStream);
									settled = true;
								}

								if (settled) {
									clearInterval(interval);
								}
							}, 300);
						}
					} else {
						if (audioElements.current[remoteUser.id]) {
							audioElements.current[remoteUser.id].srcObject = remoteStream;

							console.log("remoteStream 3", remoteStream);
						} else {
							let settled = false;
							const interval = setInterval(() => {
								if (audioElements.current[remoteUser.id]) {
									audioElements.current[remoteUser.id].srcObject = remoteStream;
									console.log("remoteStream 4", remoteStream);
									settled = true;
								}

								if (settled) {
									clearInterval(interval);
								}
							}, 300);
						}
					}
				});
			};

			console.log(
				"Local media stream tracks:",
				localMediaStream.current.getTracks(),
			);
			// Add connection to peer connections track
			if (remoteUser.id === "audioplayer") {
				// Assign the audio stream to the audio player
				if (audioStream.current) {
					audioStream.current.getTracks().forEach((track) => {
						const existingSenders = connections.current[peerId].getSenders();
						const trackAlreadyAdded = existingSenders.some(
							(sender) => sender.track === track,
						);

						if (!trackAlreadyAdded) {
							connections.current[peerId].addTrack(track, audioStream.current);
							console.log("Stream Added 3");
						}
					});
				} else {
					let settled = false;
					const interval = setInterval(() => {
						if (audioStream.current) {
							audioStream.current.getTracks().forEach((track) => {
								const existingSenders =
									connections.current[peerId].getSenders();
								const trackAlreadyAdded = existingSenders.some(
									(sender) => sender.track === track,
								);

								if (!trackAlreadyAdded) {
									connections.current[peerId].addTrack(
										track,
										audioStream.current,
									);
									console.log("Stream added 4");
								}
								settled = true;
							});
						}

						if (settled) {
							clearInterval(interval);
						}
					}, 300);
				}
			} else {
				if (localMediaStream.current) {
					localMediaStream.current.getTracks().forEach((track) => {
						const existingSenders = connections.current[peerId].getSenders();
						const trackAlreadyAdded = existingSenders.some(
							(sender) => sender.track === track,
						);

						if (!trackAlreadyAdded) {
							connections.current[peerId].addTrack(
								track,
								localMediaStream.current,
							);
							console.log("Stream added 1 ", track);
						}
					});
				} else {
					let settled = false;
					const interval = setInterval(() => {
						if (localMediaStream.current) {
							localMediaStream.current.getTracks().forEach((track) => {
								const existingSenders =
									connections.current[peerId].getSenders();
								const trackAlreadyAdded = existingSenders.some(
									(sender) => sender.track === track,
								);

								if (!trackAlreadyAdded) {
									connections.current[peerId].addTrack(
										track,
										localMediaStream.current,
									);

									console.log("Stream added 2 ");
								}
							});
							settled = true;
						}

						if (settled) {
							clearInterval(interval);
						}
					}, 300);
				}
			}
			console.log("connections:", connections.current);
			// Create an offer if required
			if (createOffer) {
				console.log("Inside offer");
				setTimeout(async () => {
					const offer = await connections.current[peerId].createOffer();

					// Set as local description
					await connections.current[peerId].setLocalDescription(offer);

					// send offer to the server
					socket.current.emit(ACTIONS.RELAY_SDP, {
						peerId,
						sessionDescription: offer,
					});
				}, 300);
			}
		};

		const handleNewPeerForPlayer = async ({
			peerId,
			createOffer,
			user: remoteUser,
		}) => {
			// If already connected then prevent connecting again
			console.log("Connections: ", connections.current);
			console.log("render inside handle new peer", remoteUser);
			console.log("peerID", peerId);
			if (peerId in connections.current) {
				return console.warn(
					`You are already connected with ${peerId} (${user.name})`,
				);
			}

			// Store it to connections
			const iceServers = [
				...freeice(),
				{
					urls: "turn:relay1.expressturn.com:3478",
					username: "efRP4CLC6TNZZ0JZ74",
					credential: "1N0fOLTsrfVihnyN",
				},
			];
			connections.current[peerId] = new RTCPeerConnection({
				iceServers,
			});

			console.log("RTCPeerConnection created:", connections.current[peerId]);
			// Handle new ice candidate on this peer connection
			connections.current[peerId].onicecandidate = (event) => {
				console.log("onice");

				console.log("Audio onice");
				audioSocket.current.emit(ACTIONS.RELAY_ICE, {
					peerId,
					icecandidate: event.candidate,
				});
			};

			// Handle on track event on this connection
			connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
				// Check if remoteUser is defined before proceeding
				if (!remoteUser || !remoteUser.id) {
					console.error("remoteUser or remoteUser.id is undefined", remoteUser);
					return; // Exit the function if remoteUser is not defined
				}
				console.log("Inside ontrack");
				// Proceed to add the new client if remoteUser is defined
				addNewClient({ ...remoteUser, muted: true }, () => {
					console.log(
						"render add new client remote",
						9,
						"for user:",
						remoteUser.id,
					);
					console.log("audioElements: ", audioElements.current);
					if (remoteUser.id === "audioplayer") {
						if (audioElements.current["audio-player"]) {
							audioElements.current["audio-player"].srcObject = remoteStream;
							console.log("remoteStream 1", remoteStream);
						} else {
							let settled = false;
							const interval = setInterval(() => {
								if (audioElements.current["audio-player"]) {
									audioElements.current["audio-player"].srcObject =
										remoteStream;
									console.log("remoteStream 2", remoteStream);
									settled = true;
								}

								if (settled) {
									clearInterval(interval);
								}
							}, 300);
						}
					} else {
						if (audioElements.current[remoteUser.id]) {
							audioElements.current[remoteUser.id].srcObject = remoteStream;

							console.log("remoteStream 3", remoteStream);
						} else {
							let settled = false;
							const interval = setInterval(() => {
								if (audioElements.current[remoteUser.id]) {
									audioElements.current[remoteUser.id].srcObject = remoteStream;
									console.log("remoteStream 4", remoteStream);
									settled = true;
								}

								if (settled) {
									clearInterval(interval);
								}
							}, 300);
						}
					}
				});
			};

			console.log(
				"Local media stream tracks:",
				localMediaStream.current.getTracks(),
			);
			if (audioStream.current)
				console.log("Audio stream tracks:", audioStream.current.getTracks());

			// Add connection to peer connections track
			if (audioStream.current) {
				audioStream.current.getTracks().forEach((track) => {
					const existingSenders = connections.current[peerId].getSenders();
					const trackAlreadyAdded = existingSenders.some(
						(sender) => sender.track === track,
					);

					if (!trackAlreadyAdded) {
						connections.current[peerId].addTrack(track, audioStream.current);
						console.log("Stream Added 3", track);
					}
				});
			} else {
				let settled = false;
				const interval = setInterval(() => {
					if (audioStream.current) {
						audioStream.current.getTracks().forEach((track) => {
							const existingSenders = connections.current[peerId].getSenders();
							const trackAlreadyAdded = existingSenders.some(
								(sender) => sender.track === track,
							);

							if (!trackAlreadyAdded) {
								connections.current[peerId].addTrack(
									track,
									audioStream.current,
								);
								console.log("Stream added 4");
							}
							settled = true;
						});
					}

					if (settled) {
						clearInterval(interval);
					}
				}, 300);
			}

			console.log("connections:", connections.current);
			// Create an offer if required
			if (createOffer) {
				console.log("Inside offer");
				const offer = await connections.current[peerId].createOffer();

				// Set as local description
				await connections.current[peerId].setLocalDescription(offer);

				// send offer to the server

				audioSocket.current.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: offer,
				});
			}
		};

		// Listen for add peer event from ws
		socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
		if (owner) {
			setTimeout(() => {
				audioSocket.current.on(ACTIONS.ADD_PEER, handleNewPeerForPlayer);
			}, 500);
		}

		return () => {
			socket.current.off(ACTIONS.ADD_PEER);
			if (owner) {
				setTimeout(() => {
					audioSocket.current.off(ACTIONS.ADD_PEER);
				}, 500);
			}
		};
	}, []);
	// Handle ice candidate
	useEffect(() => {
		console.log("render handle ice candidate out", 10);
		socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
			if (icecandidate) {
				connections.current[peerId].addIceCandidate(icecandidate);
			}
		});
		if (owner) {
			setTimeout(() => {
				audioSocket.current.on(
					ACTIONS.ICE_CANDIDATE,
					({ peerId, icecandidate }) => {
						if (icecandidate) {
							connections.current[peerId].addIceCandidate(icecandidate);
						}
					},
				);
			}, 500);
		}

		return () => {
			socket.current.off(ACTIONS.ICE_CANDIDATE);
			if (owner) {
				setTimeout(() => {
					audioSocket.current.off(ACTIONS.ICE_CANDIDATE);
				}, 500);
			}
		};
	}, []);

	// Handle session description

	useEffect(() => {
		console.log("render set remote media", 11);
		const setRemoteMedia = async ({
			peerId,
			sessionDescription: remoteSessionDescription,
		}) => {
			connections.current[peerId].setRemoteDescription(
				new RTCSessionDescription(remoteSessionDescription),
			);

			// If session descrition is offer then create an answer
			if (remoteSessionDescription.type === "offer") {
				const connection = connections.current[peerId];

				const answer = await connection.createAnswer();
				connection.setLocalDescription(answer);

				socket.current.emit(ACTIONS.RELAY_SDP, {
					peerId,
					sessionDescription: answer,
				});
				if (owner) {
					setTimeout(() => {
						audioSocket.current.emit(ACTIONS.RELAY_SDP, {
							peerId,
							sessionDescription: answer,
						});
					}, 500);
				}
			}
		};

		socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
		if (owner) {
			setTimeout(() => {
				audioSocket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
			}, 500);
		}
		return () => {
			socket.current.off(ACTIONS.SESSION_DESCRIPTION);
			if (owner) {
				setTimeout(() => {
					audioSocket.current.off(ACTIONS.SESSION_DESCRIPTION);
				}, 500);
			}
		};
	}, []);

	useEffect(() => {
		console.log("render handle remove peer out", 12);
		const handleRemovePeer = ({ peerId, userId }) => {
			console.log("render inside handle remove peer out", 13);
			// Correction: peerID to peerId
			if (connections.current[peerId]) {
				connections.current[peerId].close();
			}

			delete connections.current[peerId];
			delete audioElements.current[peerId];
			setClients((list) => list.filter((c) => c.id !== userId));
		};

		socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
		if (owner) {
			setTimeout(() => {
				audioSocket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
			}, 1000);
		}
		return () => {
			for (let peerId in connections.current) {
				connections.current[peerId].close();
				delete connections.current[peerId];
				delete audioElements.current[peerId];
				console.log("removing", connections.current);
			}
			socket.current.off(ACTIONS.REMOVE_PEER);
			if (owner) audioSocket.current.off(ACTIONS.REMOVE_PEER);
		};
	}, []);

	useEffect(() => {
		// handle mute and unmute
		console.log("render inside mute useEffect", 14);
		socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
			setMute(true, userId);
			console.log("mute info");
		});

		socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
			setMute(false, userId);
			console.log("mute info");
		});

		const setMute = (mute, userId) => {
			const clientIdx = clientsRef.current
				.map((client) => client.id)
				.indexOf(userId);
			const allConnectedClients = JSON.parse(
				JSON.stringify(clientsRef.current),
			);
			if (clientIdx > -1) {
				allConnectedClients[clientIdx].muted = mute;
				setClients(allConnectedClients);
			}
		};
	}, []);

	const handleMute = (isMute, userId) => {
		let settled = false;

		if (userId === user.id) {
			let interval = setInterval(() => {
				if (localMediaStream.current) {
					localMediaStream.current.getTracks()[0].enabled = !isMute;
					if (isMute) {
						console.log("ismute hit");
						socket.current.emit(ACTIONS.MUTE, {
							roomId,
							userId: user.id,
						});
					} else {
						console.log("ismute hit");
						socket.current.emit(ACTIONS.UNMUTE, {
							roomId,
							userId: user.id,
						});
					}
					settled = true;
				}
				if (settled) {
					clearInterval(interval);
				}
			}, 200);
		}
	};

	// Modify provideRef to only handle other audio elements
	const provideRef = (instance, userId) => {
		if (userId !== player.id) {
			audioElements.current[userId] = instance;
		}
	};

	return {
		clients,
		provideRef,
		handleMute,
		addSongToQueue,
		playNextSong,
	};
};
