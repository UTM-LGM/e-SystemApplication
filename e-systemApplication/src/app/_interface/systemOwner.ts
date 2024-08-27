export interface SystemOwner{
    id:number
    systemId:number | null
    userId:number | null
    isActive:boolean
    createdBy:string
    createdDate:Date
    updatedBy:string
    updatedDate:Date
    systemName:string
    divId:string | null
    unitId:string | null
    role:string
    email:string
}