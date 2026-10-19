export interface User {
    id?: number
    username?: string
    email: string
    password: string 
};


export interface dataUser {
    username: string
    email: string
}

export interface Transaction {
    id?: number
    date: string
    description: string
    category: string
    type: string
    amount: number
}

export interface Category {
    id: number
    category_name: string
}

export interface Type {
    id: number
    type_name: string
}

export type ModalModes = "add" | "edit";

export type MessageType = "good" | "bad" | "info";

export interface StateMessage {
    active: boolean
    message: string
    type: MessageType
}