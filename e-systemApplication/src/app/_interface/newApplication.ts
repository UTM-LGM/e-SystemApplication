export interface NewApplication{
    id:number
    systemId:number | null
    divId:number | null
    unitId:number | null
    userId:number | null
    dateApplied:Date
    systemRoleId :number | null
    createdBy:string
    status:string
    userEmail:string
    approvalId:number
}