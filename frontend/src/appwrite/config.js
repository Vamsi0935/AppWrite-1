import { Client, Account, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://app-write-1.vercel.app')
    .setProject('670c98b30011dd2ae8c2');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
