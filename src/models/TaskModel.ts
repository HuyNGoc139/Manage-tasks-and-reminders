export interface TaskModel {
    createAt: any;
    id?:string;
    title: string;
    description: string;
    dueDate: any;
    start: any
    end: any;
    uids: string[];
    color?: string;
    attachment:Attachment[];
    progress:number,
    isUrgent:boolean,
    updateAt:any,
  }

export interface Attachment{
  name:string;
  url:string;
  size: number;
  type?:string;
}
export interface SubTask {
  createdAt: number;
  description: string;
  id: string;
  isComplete: boolean;
  taskId: string;
  title: string;
  updatedAt: number;
}