export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    startdate: Date;
    enddate: Date;
    selectedSkills: ISkill,
    otherSelectedSkills: [],
    id: number
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