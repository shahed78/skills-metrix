export interface IUser {
  id: number;
  name: string;
  email: string;
  start_time: string;
  completion_time: string;
  skillsMultiCtrl: ISkill[],
  
}

export  interface ISkill {
    name: string;
    type: string;
    id: number;
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
  [key: string]: string | number; // Allow any additional string or number properties
}

export interface UserInfo {
  users: IUser[],
  skills: ISkill[]
}