import axios from 'axios'
import useSWR from 'swr'
import Router from 'next/router'
export const apiUrl = process.env.NEXT_PUBLIC_RESOURCE_URL;
import { useAuth } from '../contexts/auth'


export default function useResource() {


    const { logout } = useAuth()

    const { data, error, mutate } = useSWR([apiUrl], fetchResource);

    async function fetchResource(apiUrl) {

        try {
            const response = await axios.get(apiUrl);

            return response.data;

        } catch (error) {
            handleError(error);
        }
    }

    async function createResource(info) {

        try {
            const createUrl=apiUrl+ 'create/'
            await axios.post(createUrl, info).then(response =>  {Router.push('/login')}
            );
            mutate(); // mutate causes complete collection to be refetched

        } catch (error) {
            handleError(error);
        }
    }

    // helper function to handle getting Authorization headers EXACTLY right
    
    function handleError(error) {
        console.error(error);
        // currently just log out on error
        // but a common error will be short lived token expiring
        // STRETCH: refresh the access token when it has expired
        logout();
    }

    return {
        users: data,
        error,
        loading:  !error ,
        createResource,
    }
}
