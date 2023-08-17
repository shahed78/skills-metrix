export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    startdate: Date;
    enddate: Date;
    selectedSkills: ISkill,
  }

export  interface ISkill {
    name: string;
    type: string;
  }