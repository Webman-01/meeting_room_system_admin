import type { CreateMeetingRoom } from "@/types/meetingRoom.types";
import type { UserInfo, UpdatePassword } from "@/types/user.types";
import type { SearchBookingData } from "@/views/manage/bookingManage.vue";
import { message } from "ant-design-vue";
import axios, { type AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 3000,
});
//refreshToken
export async function refreshToken() {
  const res = await axiosInstance.get("/user/admin/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  if (res.status === 401) window.location.href = "/login";
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
//refresh写在二次封装的axios中，refreshToken()函数调用刷新token的接口，返回一个新的refresh_toke
//和access_token,存到localStorage中，在请求拦截器中从localStorage中取出access_token判断如果存在就给请求头信息加上authorization
//在响应拦截器中处理:
//1.token失效时自动刷新：如果返回的是401就刷新token，但是现在在token过期后会陷入死循环,因为每次刷新token函数执行都会有收到请求响应拦截器拦截
//又会进入到响应拦截器，而此时refresh_token过期了，服务器也返回data.code==401就会一直发送请求下去，因此在判断时加上不是针对refresh_token的判断
//做法：排除刷新token的的接口路径
//2.还要解决并发请求的问题：如果都access_token失效了，比如说并发3个请求，会执行3次refresh
//可以用一个refreshing标签和一个队列来解决：=> 在响应拦截器外定义这个refreshing变量和queue队列[]并把refreshing设置为false
//在响应拦截器中判断，如果正在刷新就返回一个promise,把resolve和config加入队列，然后在后续判断过期之后把refreshing设为true,这样
//其他的并发请求就会被放进队列，然后在刷新token成功后在遍历队列把其中的请求拿出来执行
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
    console.log(error.response);
    console.log(config.url.includes("/user/admin/refresh"));

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }
    if (data.code === 401 && !config.url.includes("/user/admin/refresh")) {
      console.log(111);
      refreshing = true; //标记为正在刷新

      //刷新token
      const res = await refreshToken();

      refreshing = false; //刷新结束

      //如果刷新成功
      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        console.log(2222);

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
//解冻用户
export async function thaw(id: number) {
  return await axiosInstance.get("/user/thaw", {
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
//根据会议室名称获取预订情况
export async function getBookingByMeetingRoomName(meetingRoomName: string) {
  return await axiosInstance.get("/booking/list", {
    params: {
      meetingRoomName,
    },
  });
}

//预订管理模块
export async function bookingList(
  searchBooking: SearchBookingData,
  pageNo: number,
  pageSize: number
) {
  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;
  if (searchBooking.rangeStartTime) {
    bookingTimeRangeStart = dayjs(
      dayjs(searchBooking.rangeStartTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }
  if (searchBooking.rangeEndTime) {
    bookingTimeRangeEnd = dayjs(
      dayjs(searchBooking.rangeEndTime).format("YYYY-MM-DD HH:mm:ss")
    ).valueOf();
  }

  return await axiosInstance.get("/booking/list", {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}
export async function apply(id: number) {
  return await axiosInstance.get("/booking/apply/" + id);
}
export async function reject(id: number) {
  return await axiosInstance.get("/booking/reject/" + id);
}
export async function unbind(id: number) {
  return await axiosInstance.get("/booking/unbind/" + id);
}
//统计管理模块
export async function meetingRoomUsedCount(startTime: string, endTime: string) {
  return await axiosInstance.get("/statistic/meetingRoomUsedCount", {
    params: {
      startTime,
      endTime,
    },
  });
}
export async function userBookingCount(startTime: string, endTime: string) {
  return await axiosInstance.get("/statistic/userBookingCount", {
    params: {
      startTime,
      endTime,
    },
  });
}
