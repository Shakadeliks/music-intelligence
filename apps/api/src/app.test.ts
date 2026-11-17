import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from './app.ts'

const app = buildApp({ logger: false })

test('POST /artists accepts a valid body', async () => {

    const response =  await app.inject({
        method: 'POST',
        url: '/artists',
        payload: {name: 'Aphex Twin'}
    })

    assert.equal(response.statusCode, 201)
})

test('POST /artists rejects a required that is undefined', async () => {

    const response =  await app.inject({
        method: 'POST',
        url: '/artists',
        payload: {}
    })

    assert.equal(response.statusCode, 400)
})

test('POST /artists does not coerce numbers to strings', async () => {

    const response =  await app.inject({
        method: 'POST',
        url: '/artists',
        payload: { name: 42 }
    })

    assert.equal(response.statusCode, 400)
})

test('POST /artists does not accept malformed JSON', async () => {

    const response =  await app.inject({
        method: 'POST',
        url: '/artists',
        headers: { 'content-type': 'application/json' },
        payload: '{broken'
    })

    assert.equal(response.statusCode, 400)
})