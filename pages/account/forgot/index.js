import Head from "next/head"; 

import { supabase } from '@/utilities/supabase';
import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal'
import { JustButton } from "@/components/JustButton"

import styles from './index.module.scss' 

function Forgot() {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [theError, setTheError] = useState(false);

    function onInputChange (e) { 
        const { value } = e.target;
        setEmail(value)
    }

    async function handleSubmit(e) {

        e.preventDefault();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://todo.icruso.ro/change',
        })
    
        if (error) {
            setTheError(true);
            setTimeout(() => {
                setTheError(false);
            }, 3000);
        } else {
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 3000);
        }
    }

    return <>

        <Head>
            <title>Password reset</title>
        </Head>
        <div className={styles.container}>
                <h2>Reset you password</h2>
                <form 
                    onSubmit={handleSubmit}
                    className={styles.forgotForm}
                >
                    <label htmlFor="email">Email</label>
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Enter the account email address" 
                        required
                        onChange={onInputChange}
                    />
                    <JustButton text="Send" type="submit"/>  
                </form>
                {show && ( 
                    <Modal message={'Follow the instructions received by email to change your password'} status='succes'/>
                )}
                {theError && ( 
                    <Modal message={'An error has occurred'} status='fail'/>
                )}
        </div>

    </>

}


export default Forgot