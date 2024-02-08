//定义在仓库booking.ts中要遍历对象的类型
export interface ListDataType {
  type: string;
  content: string;
}
export interface BookingsType {
  id: number;
  createTime: string;
  startTime: string;
  endTime: string;
  note: string;
  status: string;
  updateTime: string;
  room: Room;
  user: User;
}
interface Room {
  capacity: string;
  createTime: string;
  updateTime: string;
  description: string;
  equipment: string;
  id: number;
  isBooked: boolean;
  location: string;
  name: string;
}
interface User {
  avatar: string;
  createTime: string;
  updateTime: string;
  email: string;
  id: number;
  isAdmin: boolean;
  isFrozen: boolean;
  nickname: string;
  phoneNumber: string;
  username: string;
}
