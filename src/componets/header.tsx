/** @format */

import type {JSX, ParentComponent, ParentProps} from 'solid-js'
import {createSignal} from 'solid-js'
interface ITheme {
    theme: 'light' | 'dark'
}
export const Header: ParentComponent<ParentProps<ITheme>> = (props: ParentProps<ITheme>) => {
    return (
        <main class='container' data-theme={props.theme}>
            {props.children}
        </main>
    )
}
