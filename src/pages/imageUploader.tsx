/** @format */

import type {JSX, Component, ParentProps} from 'solid-js'
import {createSignal, createEffect, Show} from 'solid-js'
import request from 'utils/request'
import {CreateShortUrl, baseUrl} from '../const/urls'
import {useNav} from 'componets/nav'
import {stringify} from 'qs'
import uploader from '../utils/web'
import {Event as HanleEvent} from 'utils/uploader'
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
import {IContext} from 'utils/uploader'
import {render} from 'solid-js/web'
type ISubmit = JSX.EventHandlerUnion<
    HTMLFormElement,
    Event & {
        submitter: HTMLElement
    }
>
export const ImageUploader: Component = () => {
    const onSubmit: ISubmit = e => {
        e.preventDefault()
        console.log(e)
        console.log(e.target.elements)
        const el = e.target.elements[0] as HTMLInputElement
        if (el.files) {
            const file = el.files[0]
            const ctx: IContext = {
                maxConcurrency: 5,
                totalSize: file.size,
                chunkSize: 1024 * 1024,
                uploadUrl: baseUrl + '/2/uploader/upload',
                mergeUrl: baseUrl + '/2/uploader/merge',
                touchUrl: baseUrl + '/2/uploader/init',
                testChunks: false,
                //credentials: 'include',
                mod: 'cors',
            }
            const up = uploader(ctx, file)

            up.on(HanleEvent.Progress, e => {
                console.log('progess', e)
                setProgress(Math.floor((e.uploadedSize * 100) / e.totalSize))
            })
            up.on(HanleEvent.Complete, e => {
                console.log('complete', e)
                alert(e.url)
                setShortUrl(e.url)
            })
            up.run()
        }

        const data = {url: el.value}

        // request
        //     .post(CreateShortUrl, {
        //         data: stringify(data),
        //         //  credentials: 'include',
        //         mod: 'cors',
        //         headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        //     })
        //     .then(res => {
        //         return res.json()
        //     })
        //     .then(resp => setShortUrl(resp.short_url))
        //     .catch(e => console.log(e))
    }
    const onChange = () => {
        setChange(true)
    }
    const [changed, setChange] = createSignal<boolean>(false)
    const [shortUrl, setShortUrl] = createSignal<string>('')
    const [progress, setProgress] = createSignal<number>(0)
    const [src, setSrc] = createSignal<string>('https://img.tiyee.cn/b625.jpg!w400')
    const [openState, {open, close, setTitle}] = useNav()
    const isRouting = useIsRouting()
    if (isRouting()) {
        setTitle('图床')
    }
    const onFileChange: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = e => {
        setChange(true)
        console.log(e.target.files)
        if (e.target.files) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onerror = function () {
                console.log('error')
            }
            reader.onload = function (e) {
                // urlData就是对应的文件内容
                const urlData = reader.result as string

                setSrc(urlData)
            }
        }
    }
    return (
        <form id='form' onSubmit={onSubmit}>
            <label for='file'>
                <input onChange={onFileChange} type='file' id='file' name='file' />
            </label>
            <label for='lastname'>
                <img width='200px' src={src()} />
            </label>
            <Show when={progress.length > 0}>
                <progress value={progress()} max='100'></progress>
            </Show>

            <Show when={shortUrl().length > 0}>
                <label for='short_url'>图片地址</label>
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
                上传
            </button>
        </form>
    )
}
