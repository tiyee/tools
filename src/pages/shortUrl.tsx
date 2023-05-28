/** @format */

import type {JSX, Component, ParentProps} from 'solid-js'
import {createSignal, createEffect, Show} from 'solid-js'
import request from 'utils/request'
import {CreateShortUrl} from '../const/urls'
import {useNav} from 'componets/nav'
import {stringify} from 'qs'
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
export const ShortUrl: Component = () => {
    const onSubmit: ISubmit = e => {
        e.preventDefault()
        console.log(e)
        const el = e.currentTarget.elements[0] as HTMLInputElement
        console.log(el.value)
        setShortUrl('http://baidu.com')
        const data = {url: el.value}

        request
            .post(CreateShortUrl, {
                data: stringify(data),
                //  credentials: 'include',
                mod: 'cors',
                headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            })
            .then(res => {
                return res.json()
            })
            .then(resp => setShortUrl(resp.short_url))
            .catch(e => console.log(e))
    }
    const onChange = () => {
        setChange(true)
        setShortUrl('')
    }
    const [changed, setChange] = createSignal<boolean>(false)
    const [shortUrl, setShortUrl] = createSignal<string>('')
    const [openState, {open, close, setTitle}] = useNav()
    const isRouting = useIsRouting()
    if (isRouting()) {
        setTitle('短链生成器')
    }

    return (
        <form onSubmit={onSubmit}>
            <label for='url'>目标地址</label>
            <input
                onChange={onChange}
                autocomplete='off'
                autofocus={true}
                type='url'
                id='url'
                name='url'
                placeholder='请输入目标地址'
                required
            />
            <small>
                目标地址必须是<code>http://</code>或<code>https://</code>开头
            </small>
            <Show when={shortUrl().length > 0}>
                <label for='short_url'>短链地址</label>
                <input
                    type='url'
                    autocomplete='off'
                    id='short_url'
                    value={shortUrl()}
                    name='short_url'
                    placeholder=''
                    readonly
                />
            </Show>
            <button disabled={!changed()} type='submit'>
                创建
            </button>
        </form>
    )
}
