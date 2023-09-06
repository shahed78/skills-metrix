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