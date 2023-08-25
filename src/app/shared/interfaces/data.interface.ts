export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    startdate: Date;
    enddate: Date;
    selectedSkills: ISkill,
    otherSelectedSkills: []
  }

export  interface ISkill {
    name: string;
    type: string;
  }