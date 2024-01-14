import type { CreateMeetingRoom } from "@/types/meetingRoom.types";
import type { UserInfo, UpdatePassword } from "@/types/user.types";
import type {
  BookingSearchResult,
  SearchBookingData,
} from "@/views/manage/bookingManage.vue";
import { message } from "ant-design-vue";
import axios, { type AxiosRequestConfig } from "axios";
import dayjs from "dayjs";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});
//refreshToken
async function refreshToken() {
  const res = await axiosInstance.get("/user/admin/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  const { data } = res.data;
  localStorage.setItem("access_token", data.access_token || "");
  localStorage.setItem("refresh_token", data.refresh_token || "");
  return res;
}

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code == 401 && !config.url.includes("/user/admin/refresh")) {
      refreshing = true; //标记为正在刷新

      const res = await refreshToken();

      refreshing = false; //刷新结束

      if (res.status == 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });
        return axiosInstance(config);
      } else {
        message.error(res.data);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);
export async function login(username: string, password: string) {
  return await axiosInstance.post("user/admin/login", { username, password });
}
export async function userSearch(
  username: string,
  nickName: string,
  email: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/user/list", {
    params: {
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    },
  });
}
//冻结用户
export async function freeze(id: number) {
  return await axiosInstance.get("/user/freeze", {
    params: {
      id,
    },
  });
}
//修改用户信息部分
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}
export async function updateUserInfo(data: UserInfo) {
  return await axiosInstance.post("/user/admin/update_userInfo", data);
}
export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/updateUserInfo/captcha");
}

//修改密码部分
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/admin/update_password", data);
}
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

//会议室管理模块
export async function meetingRoomList(
  name: string,
  capacity: string,
  equipment: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/meeting-room/list", {
    params: {
      name,
      capacity,
      equipment,
      pageNo,
      pageSize,
    },
  });
}

export async function deleteMeetingRoom(id: number) {
  return await axiosInstance.delete("/meeting-room/" + id);
}
export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
  return await axiosInstance.post("/meeting-room/create", meetingRoom);
}
export async function updateMeetingRoom(meetingRoom: CreateMeetingRoom) {
  return await axiosInstance.put("/meeting-room/update", meetingRoom);
}
export async function findMeetingRoom(id: number) {
  return await axiosInstance.get("/meeting-room/find" + id);
}

//预订管理模块
export async function bookingList(
  searchBooking: SearchBookingData,
  pageNo: number,
  pageSize: number
) {
  // console.log(searchBooking,'axios');
  // console.log(searchBooking.rangeStartTime,'t1');
  // console.log(dayjs(searchBooking.rangeStartTime),'t2');
  // console.log(dayjs(searchBooking.rangeStartTime).valueOf(),'t3');
  // console.log(dayjs(searchBooking.rangeStartTime).format('YYYY-MM-DD HH:mm:ss'),'t4');
  // console.log(dayjs(dayjs(searchBooking.rangeStartTime).format('YYYY-MM-DD HH:mm:ss')).valueOf(),'t5');
  // console.log(dayjs(dayjs(searchBooking.rangeEndTime).format('YYYY-MM-DD HH:mm:ss')).valueOf(),'t6');
  // console.log( new Date('2023-12-27 00:00:00').getTime(),'27');
  // console.log( new Date('2023-12-28').getTime(),'28');
  // console.log(new Date('2023-12-27').toISOString(),'21 oo');
  // console.log(new Date(1703606400000),'time');
  
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;
  if(searchBooking.rangeStartTime){
    bookingTimeRangeStart = dayjs(dayjs(searchBooking.rangeStartTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()
  }
  if(searchBooking.rangeEndTime){
    bookingTimeRangeEnd = dayjs(dayjs(searchBooking.rangeEndTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()
  }

  
  
  return await axiosInstance.get("/booking/list", {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo:pageNo,
      pageSize:pageSize
    },
  });
}
export async function apply(id:number){
  return await axiosInstance.get('/booking/apply/'+id)
}
export async function reject(id:number){
  return await axiosInstance.get('/booking/reject/'+id)
}
export async function unbind(id:number){
  return await axiosInstance.get('/booking/unbind/'+id)
}
//统计管理模块
export async function meetingRoomUsedCount(startTime:string,endTime:string){
  return await axiosInstance.get('/statistic/meetingRoomUsedCount',{
    params:{
      startTime,
      endTime
    }
  })
}
export async function userBookingCount(startTime:string,endTime:string){
  return await axiosInstance.get('/statistic/userBookingCount',{
    params:{
      startTime,
      endTime
    }
  })
}
