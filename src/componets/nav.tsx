/** @format */
import type {JSX, Component, ParentProps, Signal, Context} from 'solid-js'
import {Routes, Route, Router, hashIntegration, useNavigate, A, useSearchParams} from '@solidjs/router'
import {createSignal, createContext, useContext, createMemo} from 'solid-js'
import {createStore} from 'solid-js/store'
export type NavContextState = {
    open: boolean
    title: string
}
export type NavContextValue = [
    state: NavContextState,
    actions: {
        open: () => void
        close: () => void
        setTitle: (title: string) => void
    },
]
const defaultState = {
    open: false,
    title: '首页',
}
const NavContext = createContext<NavContextValue>([
    defaultState,
    {
        open: () => undefined,
        close: () => undefined,
        setTitle: (title: string) => undefined,
    },
])

export const NavProvider: Component<ParentProps<NavContextState>> = props => {
    const [state, setState] = createStore({open: props.open || false, title: props.title})

    const open = () => {
        setState('open', true)
    }
    const close = () => {
        setState('open', false)
    }
    const setTitle = (title: string) => {
        setState('title', title)
    }
    return <NavContext.Provider value={[state, {open, close, setTitle}]}>{props.children}</NavContext.Provider>
}
export const useNav = () => useContext(NavContext)

export const Nav: Component = () => {
    const [openState, {open, close, setTitle}] = useNav()
    // const onClick: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = e => {
    //     e.preventDefault()
    //     console.log(e.currentTarget.pathname)
    //     const navigate = useNavigate()
    //     close()
    //     navigate(e.currentTarget.pathname)
    // }

    return (
        <nav>
            <ul>
                <li role='list' dir='rtl'>
                    <a
                        onclick={e => {
                            e.preventDefault()
                        }}
                        href='#'
                        aria-haspopup='listbox'>
                        <svg
                            aria-hidden='true'
                            role='img'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            height='32px'
                            fill='none'
                            stroke='currentColor'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'>
                            <line x1='3' y1='12' x2='21' y2='12'></line>
                            <line x1='3' y1='6' x2='21' y2='6'></line>
                            <line x1='3' y1='18' x2='21' y2='18'></line>
                        </svg>
                    </a>
                    <ul role='listbox'>
                        <li>
                            <A href='/?fr=nav' data-theme-switcher='dark'>
                                首页
                            </A>
                        </li>
                        <li>
                            <A href='/short_url?fr=nav' data-theme-switcher='auto'>
                                短链
                            </A>
                        </li>
                        <li>
                            <A href='image_uploader' data-theme-switcher='auto'>
                                图床
                            </A>
                        </li>
                    </ul>
                </li>
                {/* <li>
            <a href='#' class='secondary'>
                <svg
                    aria-hidden='true'
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    height='16px'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'>
                    <line x1='3' y1='12' x2='21' y2='12'></line>
                    <line x1='3' y1='6' x2='21' y2='6'></line>
                    <line x1='3' y1='18' x2='21' y2='18'></line>
                </svg>
            </a>
        </li> */}
            </ul>
            <ul>
                <li>
                    <strong>{openState.title}</strong>
                </li>
            </ul>
            <ul>
                <li>
                    <a href='#' class='secondary'>
                        <svg
                            class='icon'
                            viewBox='0 0 1024 1024'
                            version='1.1'
                            xmlns='http://www.w3.org/2000/svg'
                            p-id='2781'
                            width='32'
                            height='32'>
                            <path
                                d='M950.857143 512q0 143.428571-83.714286 258T650.857143 928.571429q-15.428571 2.857143-22.571429-4t-7.142857-17.142858v-120.571428q0-55.428571-29.714286-81.142857 32.571429-3.428571 58.571429-10.285715t53.714286-22.285714 46.285714-38 30.285714-60T792 489.142857q0-69.142857-45.142857-117.714286 21.142857-52-4.571429-116.571428-16-5.142857-46.285714 6.285714t-52.571429 25.142857l-21.714285 13.714286q-53.142857-14.857143-109.714286-14.857143t-109.714286 14.857143q-9.142857-6.285714-24.285714-15.428571T330.285714 262.571429 281.142857 254.857143q-25.142857 64.571429-4 116.571428-45.142857 48.571429-45.142857 117.714286 0 48.571429 11.714286 85.714286t30 60 46 38.285714 53.714285 22.285714 58.571429 10.285715q-22.857143 20.571429-28 58.857143-12 5.714286-25.714286 8.571428t-32.571428 2.857143-37.428572-12.285714T276.571429 728q-10.857143-18.285714-27.714286-29.714286t-28.285714-13.714285l-11.428572-1.714286q-12 0-16.571428 2.571428t-2.857143 6.571429 5.142857 8 7.428571 6.857143l4 2.857143q12.571429 5.714286 24.857143 21.714285t18 29.142858l5.714286 13.142857q7.428571 21.714286 25.142857 35.142857t38.285714 17.142857 39.714286 4 31.714286-2l13.142857-2.285714q0 21.714286 0.285714 50.857143t0.285714 30.857142q0 10.285714-7.428571 17.142858t-22.857143 4q-132.571429-44-216.285714-158.571429T73.142857 512q0-119.428571 58.857143-220.285714T291.714286 132 512 73.142857t220.285714 58.857143T892 291.714286 950.857143 512z'
                                p-id='2782'></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    )
}
