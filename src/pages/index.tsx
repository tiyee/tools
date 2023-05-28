/** @format */

import type {JSX, Component, ParentProps} from 'solid-js'
import {createSignal, createEffect} from 'solid-js'
import request from 'utils/request'
import {CreateShortUrl} from '../const/urls'
import {useNav} from 'componets/nav'
import {stringify} from 'qs'
import {Main} from 'layouts/Main'
import {
    Routes,
    Route,
    useIsRouting,
    Router,
    hashIntegration,
    useNavigate,
    A,
    useSearchParams,
    useLocation,
} from '@solidjs/router'
type ISubmit = JSX.EventHandlerUnion<
    HTMLFormElement,
    Event & {
        submitter: HTMLElement
    }
>
export const Index: Component = () => {
    return (
        <article>
            <details>
                <summary>Accordion 1</summary>
                <p>…</p>
            </details>

            <details open>
                <summary>Accordion 2</summary>
                <ul>
                    <li>…</li>
                    <li>…</li>
                </ul>
            </details>
        </article>
    )
}
