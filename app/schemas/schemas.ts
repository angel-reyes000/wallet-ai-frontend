export interface User {
    id?: number
    username?: string
    email: string
    password: string 
};


export interface dataUser {
    username: string
    email: string
    created_at?: string
}

export interface Transaction {
    id?: number
    date: string
    description: string
    category: string
    type: string
    amount: number
    user_id?: number
}

export interface Category {
    id: number
    category_name: string
}

export interface TotalToCategory {
    name: string | undefined
    value: number | undefined
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

export interface AppConfiguration {
    backgroundColor: boolean
    temperature: number
}

export interface Messages {
    id: number
    role: string
    message: string
    user_id?: number
}

export interface Card {
    id?: number
    name: string
    type: string
    last_numbers: string
    color: string
    expired_date: string
    created_at: string
}