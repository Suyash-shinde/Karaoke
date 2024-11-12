import axios from "axios";
import {
	refreshTokenRoute,
	logoutRoute,
	createRoomRoute,
	getRoomsRoute,
	fetchRoomRoute,
	avatarRoute,
	joinRoomRoute,
	updateRoute,
	deleteRoomRoute,
} from "./APIroutes";

const api = axios.create({
	baseURL: "http://localhost:5173",
	withCredentials: true,
	headers: {
		"Content-type": "application/json",
		Accept: "application/json",
	},
});

export const logout = () => api.post(logoutRoute);
export const createRoom = (data) => api.post(createRoomRoute, data);
export const getAllRooms = () => api.get(getRoomsRoute);
export const getRoom = (roomId) => api.get(`${fetchRoomRoute}/${roomId}`);
export const changeAvatar = (avatar) => api.post(avatarRoute, avatar);
export const joinRoomPost = (data) => api.post(joinRoomRoute, data);
export const updateUser = (data) => api.post(updateRoute, data);
export const deleteRoom = (data) => api.post(deleteRoomRoute, data);
api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status === 405 &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				await axios.post(
					refreshTokenRoute,
					{},
					{
						withCredentials: true,
					},
				);

				return api.request(originalRequest);
			} catch (error) {
				console.log(error.msg);
			}
		}
		throw error;
	},
);

export default api;
