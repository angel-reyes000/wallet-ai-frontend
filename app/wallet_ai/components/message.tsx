import { MessageType } from "@/app/schemas/schemas";
import { FaCheck, FaInfo } from "react-icons/fa";
import './menu.css';
import { IoCloseCircleOutline } from "react-icons/io5";

export default function Message ({ message, type }: { message: string, type: MessageType}) {
    if (type === "good") {
        return (
            <div className="flex flex-row items-center absolute end-0 top-15 bg-green-500 py-2 px-5 border-2 text-white rounded-xl gap-2">
                <FaCheck size={20} />
                <h1 className="font-semibold">{message}</h1>
            </div>
        )
    } else if (type === "info") {
        return (
            <div className="flex flex-row items-center absolute end-0 top-15 bg-gray-500 py-2 px-5 border-2 text-white rounded-xl gap-2">
                <FaInfo size={20} />
                <h1 className="font-semibold">{message}</h1>
            </div>
        )
    } else {
        return (
            <div className={"flex flex-row items-center absolute end-0 top-15 bg-red-500 py-2 px-5 border-2 text-white rounded-xl gap-2 message_animation_view"}>
                <IoCloseCircleOutline size={30} />
                <h1 className="font-semibold">{message}</h1>
            </div>
        )
    }
}