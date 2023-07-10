import Head from 'next/head'

import { supabase } from '@/utilities/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal';
import { JustButton } from "@/components/JustButton";

import styles from './index.module.scss';

function Auth() {

    const { isLoading, session, error } = useSessionContext();
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [justLogged, setJustLogged] = useState(false);
    const [theError, setTheError] = useState(false);

    useEffect(() => {
        if (session && !justLogged) {
            router.push('/todos');
        }
    }, [session, justLogged]);

    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    function onInputChange (e) {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {

        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email: input.email,
            password: input.password
        })
    
        if (error) {
            setTheError(error.message);
            setTimeout(() => {
                setTheError(false);
            }, 3000);
        } else {
            setShow(true);
            setJustLogged(true);
            setTimeout(() => {
                setShow(false);
                setJustLogged(false);
            }, 3000);
        }
    }

    return <>
        <Head>
            <title>Login</title>
        </Head>
        <div className={styles.container}>
            <h2>Log in your account</h2> 
            <form 
                onSubmit={handleSubmit}
                className={styles.loginForm}
            >
                <label htmlFor="email">Email</label>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    required
                    onChange={onInputChange}
                />
            
                <label htmlFor="password">Password</label>
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Enter the account password" 
                    required
                    onChange={onInputChange}
                />
                
                <div className={styles.loginPassword}>
                    <JustButton text="Login" type="submit"/>   
                    <a className={styles.forgotPassword} href="/account/forgot">Did you forget your password?</a>
                </div>
            </form>

            <div className={styles.register}>
                <h2>Don't you have an account yet?</h2>
                <JustButton text="Register" link="/account/register"/>  
            </div>

            {show && ( 
                <Modal message={'You have been successfully logged in'} status='succes'/>
            )}
            {theError && ( 
                <Modal message={theError} status='fail'/>
            )}
        </div>
    </>
}
  
export default Auth
