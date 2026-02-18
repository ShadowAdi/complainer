import { IComplaint } from "../interfaces/complaint.interface.js";
export declare const Complaint: import("mongoose").Model<IComplaint, {}, {}, {}, import("mongoose").Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
