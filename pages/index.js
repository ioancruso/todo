import styles from "./index.module.scss"

import { useSessionContext } from '@supabase/auth-helpers-react';

import { JustButton } from "@/components/JustButton"

export default function Home() {

    const { isLoading, session, error } = useSessionContext();

    return <>
        <Head>
            <title>Just Do</title>
        </Head>
        <div className={styles.container}>
            <h1>Maximize efficiency with our to-do checklist.</h1>
            <h2>Plan, manage, and track all your projects on our customizable software.</h2>
            <JustButton text="Get started" link={session ? '/todos' : '/account/register'} />
        </div>
    </>
}
