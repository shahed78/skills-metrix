// export interface IUser {
//     firstname: string;
//     lastname: string;
//     email: string;
//     startdate: Date;
//     enddate: Date;
//     selectedSkills: ISkill,
//     id: number
//   }

export interface IUser {
  id: number;
  name: string;
  email: string;
  start_time: Date;
  completion_time: Date;
  selectedSkills: ISkill,
  
}

export  interface ISkill {
    name: string;
    type: string;
    id: number;
  }

  export interface ExcelData {
    ID: number;
    "Start time": number;
    "Completion time": number;
    Email: string;
    Name: string;
    [key: string]: string | number; // Allow any additional string or number properties
  }