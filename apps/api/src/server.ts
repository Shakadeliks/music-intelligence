import { buildApp } from './app.ts'

const app = buildApp()

try {
    await app.listen({ port: 3002 })
} catch (e) {
    app.log.error(e)
    process.exit(1)
}