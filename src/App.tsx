/** @format */

import {render} from 'solid-js/web'
import {Main} from 'layouts/Main'
import {Nav, NavProvider} from 'componets/nav'
import {ShortUrl} from 'pages/shortUrl'
import {Routes, Route, Router, hashIntegration} from '@solidjs/router'
import '@picocss/pico/scss/pico.scss'
import {ImageUploader} from 'pages/imageUploader'
import {Index} from 'pages'
import request from 'utils/request'
import Ver from 'ver'
const theme = 'light'

function App() {
    const parsedUrl = new URL(window.location.href)
    request
        .get('dist/ver.json?ver=' + Math.floor(new Date().getTime() / 100000).toString())
        .then((resp: Response) => resp.json())
        .then(data => {
            console.log(data, Ver)
            const {ver} = data
            if (Ver !== ver) {
                const params = parsedUrl.searchParams
                params.set('ver', ver)
                parsedUrl.search = params.toString()
                console.log('new url is ', parsedUrl.toString())
                location.href = parsedUrl.toString()
            }
        })
        .catch(e => console.log(e))
    return (
        <Main theme={theme}>
            <NavProvider open={false} title='首页'>
                <Router source={hashIntegration()}>
                    <Nav />
                    <Routes>
                        <Route path='/short_url' element={<ShortUrl />} />
                        <Route path='/image_uploader' component={ImageUploader} />
                        <Route path='/' component={Index} />
                    </Routes>
                </Router>
            </NavProvider>
        </Main>
    )
}

render(() => <App />, document.getElementById('root')!)
