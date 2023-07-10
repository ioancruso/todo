import Head from 'next/head'

import { supabase } from '@/utilities/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal';
import { JustButton } from "@/components/JustButton";

import styles from './index.module.scss';

function Register() {

    const { isLoading, session, error } = useSessionContext();
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [theError, setTheError] = useState(false);

    useEffect(() => {
        if (session) {
            router.push('/todos');
        }
    }, [session]);

    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    
    async function handleSubmit(e) {
        e.preventDefault();

        const { error } = await supabase.auth.signUp(
            {
              email: input.email,
              password: input.password,
            }
        )
    
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

    function onInputChange (e) {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return <>
        <Head>
            <title>Registration</title>
        </Head>
        <div className={styles.container}>
            <h2>Create your account</h2>

            <form 
                onSubmit={handleSubmit}
                className={styles.registerForm}
            >
                <label htmlFor="email">Email</label>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    required
                    minLength={5} 
                    maxLength={60}
                    onChange={onInputChange}
                />

                <label htmlFor="password">Password</label>
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Enter a password for the account" 
                    required
                    minLength={5}
                    maxLength={20} 
                    onChange={onInputChange}
                />
                <JustButton text="Register" type="submit"/> 
            </form>

            <div className={styles.login}>
                <h2>Do you already have an account?</h2>
                <JustButton text="Login" link="/account/login"/> 
            </div>

            {show && ( 
                <Modal message={'The account has been created successfully.'} status='succes'/>
            )}
            {theError && ( 
                <Modal message={'An error has occurred'} status='fail'/>
            )}
        </div>
    </>
}
  
export default Register
