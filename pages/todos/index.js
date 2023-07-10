import styles from "./index.module.scss";

import Head from 'next/head'

import { supabase } from '@/utilities/supabase';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Card } from "@/components/card";

export default function Home() {
    const { isLoading, session, error } = useSessionContext();
    const [mounted, setMounted] = useState(false);
    const [todos, setTodos] = useState([]);
    const [userid, setUserid] = useState();
    const [fetch, setFetch] = useState(false);
    const [input, setInput] = useState({
        title: '',
        content: ''
    });
    const router = useRouter();
    const [selectedTodos, setSelectedTodos] = useState([]);

    function handleChange(e) {
        const { name, value } = e.target;
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const { data, error } = await supabase.from('todos').insert([
            {
                description: input.content,
                userid: userid,
                color: 0,
                solved: false,
            },
        ]);

        if (error) {
            console.log(error);
        } else {
            getTodos();
            setInput((prevInput) => ({
                ...prevInput,
                content: '',
            }));
        }
    }

    useEffect(() => {
        if (!session && mounted) {
            router.push('/account/login');
        } else if (session && session.user) {
            setUserid(session.user.id);
        }
    }, [session]);

    useEffect(() => {
        if (userid) {
            getTodos();
        }
    }, [userid]);

    useEffect(() => {
        setMounted(true);
    }, []);


    async function getTodos() {
        let { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .eq('userid', userid)
            .order('id', { ascending: false });

        if (error) {
            console.log(error);
        }
        setTodos(todos);
        setFetch(true);
    }

    async function deleteCard(id) {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(error);
        } else {
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        }
    }

    async function handleMarkAsDone() {
        for (const todoId of selectedTodos) {
            const { error } = await supabase
                .from('todos')
                .update({ solved: true })
                .eq('id', todoId);

            if (error) {
                console.error(error);
            } else {
                setTodos((prevTodos) => prevTodos.map((todo) => {
                    if (todo.id === todoId) {
                        return {
                            ...todo,
                            solved: true,
                        };
                    } else {
                        return todo;
                    }
                }));
            }
        }
        setSelectedTodos([]);
    }

    async function handleMarkAsUndone() {
        for (const todoId of selectedTodos) {
            const { error } = await supabase
                .from('todos')
                .update({ solved: false })
                .eq('id', todoId);

            if (error) {
                console.error(error);
            } else {
                setTodos((prevTodos) => prevTodos.map((todo) => {
                    if (todo.id === todoId) {
                        return {
                            ...todo,
                            solved: false,
                        };
                    } else {
                        return todo;
                    }
                }));
            }
        }
        setSelectedTodos([]);
    }

    function handleSelect(todoId) {
        setSelectedTodos((prevSelectedTodos) => {
            if (prevSelectedTodos.includes(todoId)) {
                return prevSelectedTodos.filter((id) => id !== todoId);
            } else {
                return [...prevSelectedTodos, todoId];
            }
        });
      }

    function handleSelectAll() {
        if (todos.length === selectedTodos.length) {
            setSelectedTodos([]);
        } else {
            const selectedIds = todos.map((todo) => todo.id);
            setSelectedTodos(selectedIds);
        }
    }

    async function handleDeleteSelected() {
        for (const todoId of selectedTodos) {
            await deleteCard(todoId);
        }
        setSelectedTodos([]);
    }

    return <>
        <Head>
            <title>Your Todos</title>
        </Head>
        <div className={styles.container}>
            <h1>Your Todos</h1>
            <form onSubmit={handleSubmit} className={styles.addForm}>
                <input
                    name="content"
                    placeholder="Your todo"
                    minLength={4}
                    maxLength={110}
                    required
                    value={input.content}
                    onChange={handleChange}
                    className={styles.content}
                />
                <button type="submit">Add</button>
            </form>
            {fetch && (
                <div className={styles.control}>
                    {todos.length > 0 && <>
                            {todos.length === selectedTodos.length ? (
                                <button onClick={handleSelectAll}>Deselect all</button>
                            ) : (
                                <button onClick={handleSelectAll}>Select all</button>
                            )}
                            <div className={styles.options}>
                                <button title="Delete selected todos"  onClick={handleDeleteSelected}>Delete</button>
                                {
                                    selectedTodos.length === 0 || selectedTodos.some((todoId) => {
                                        const todo = todos.find((todo) => todo.id === todoId);
                                        return todo && !todo.solved;
                                      }) ? (
                                        <button title="Mark selected todos as finished" onClick={handleMarkAsDone}>Mark as finished</button>
                                    ) : (
                                        <button title="Mark selected todos as not finished" onClick={handleMarkAsUndone}>Mark as not finished</button>
                                    )
                                }
                            </div>
                    </>}
                </div>
            )}
            {fetch && !todos.length ? (
                <div className={styles.none}>None yet</div>
            ) : (
                <div className={styles.todos}>
                    {todos.map((todo) => (
                        <Card
                            data={todo}
                            key={todo.id}
                            onDelete={deleteCard}
                            onSelect={handleSelect}
                            selected={selectedTodos.includes(todo.id)}
                            isDone={todo.solved}
                        />
                    ))}
                </div>
            )}
        </div>
    </>
}