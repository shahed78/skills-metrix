export interface IUser {
  id: number;
  name: string;
  email: string;
  start_time: string;
  completion_time: string;
  location: string;
  role: string;
  skillsMultiCtrl: ISkill[],
  
}

export  interface ISkill {
    name: string;
    type: string;
    id: number;
  }

export interface IKnowladge {
  name: string;
  type: string;
}

export interface ExcelData {
  ID: number;
  "Start time": string;
  "Completion time": string;
  Email: string;
  Name: string;
  Databases: string;
  "Delivery Methodologies": string;
  Languages: string;
  "Test Tools": string;
  "Version Control": string;
  Location: string;
  Role: string;
  [key: string]: string | number; // Allow any additional string or number properties
}

export interface UserInfo {
  users: IUser[],
  skills: ISkill[]
}

export interface ApiResponse {
  success: boolean;
  message: string;
  // other properties as needed
}

export interface ChartDataItem {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

export interface ChartData {
  [key: string]: ChartDataItem;
}