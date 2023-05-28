/** @format */
import type {JSX, Component, Signal} from 'solid-js'
import {createSignal} from 'solid-js'
import {useNav} from './nav'
export const Button: Component = () => {
    const [openState, {open, close}] = useNav()
    const [count, setCount] = createSignal<number>(0)
    return (
        <button
            onClick={() => {
                setCount(c => c + 1)
                if (openState.open) {
                    close()
                } else {
                    open()
                }
            }}>
            {openState.open ? 'open' : 'close'}
        </button>
    )
}
