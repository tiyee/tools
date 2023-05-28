/** @format */

import type { JSX, Component, ParentProps } from 'solid-js'
import { createSignal, createEffect } from 'solid-js'
import request from 'utils/request'
import { CreateShortUrl } from '../const/urls'
import { useNav } from 'componets/nav'
import { stringify } from 'qs'
import { Main } from 'layouts/Main'
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
        <summary>短链</summary>
        <p>
          短链的<code>input</code>组件用的是HTML的<code>&lt;input type="url"&gt;</code>
          ,所以地址必须包含完整的protocol,否则浏览器会拦截提交
        </p>
      </details>

      <details >
        <summary>图床</summary>
        <ul>
          <li>
            <p>目前最大支持100M的图片，</p>
          </li>

        </ul>
      </details>
    </article>
  )
}
