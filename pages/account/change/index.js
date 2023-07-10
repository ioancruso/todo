import Head from "next/head"; 

import { supabase } from '@/utilities/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal'
import { JustButton } from "@/components/JustButton"

import styles from './index.module.scss' 

function Change() {

    const { isLoading, session, error } = useSessionContext();
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [theError, setTheError] = useState(false);

    const [password, setPassword] = useState();

    function onInputChange (e) {
        const { value } = e.target;
        setPassword(value)
    }
    
    useEffect(() => {
        if (session) {
            router.push('/todos');
        }
    }, [session]);

    async function handleSubmit(e) {

        e.preventDefault();

        const { error } = await supabase.auth.updateUser({
            password: password
        })
    
        if (error) {
            console.log(error);
            setTheError(true);
            setTimeout(() => {
                setTheError(false);
            }, 3000);
        } else {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000);
            setTimeout(() => {
                router.push('/account/login');
            }, 3500);
        }
    }

    return <>
        <Head>
            <title>Change password</title>
        </Head>
        <div className={styles.container}>
            <h2>Change your password</h2>
            <form 
                onSubmit={handleSubmit}
                className={styles.changeForm}
            >
                <label htmlFor="email">New password</label>
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Enter the new password for your account" 
                    required
                    onChange={onInputChange}
                />
                <JustButton text="Change" type="submit"/>      
            </form>
            {show && ( 
                <Modal message={'The password has been successfully changed. You will be redirected to the login page'} status='succes'/>
            )}
            {theError && ( 
                <Modal message={'An error has occurred'} status='fail'/>
            )}
        </div>
    </>

}


export default Change