import Fastify, { type FastifyError} from 'fastify'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { pool } from './db.ts'

export function buildApp(options = { logger: true }) {

    const fastify = Fastify(options).withTypeProvider<ZodTypeProvider>()
    fastify.setValidatorCompiler(validatorCompiler)
    fastify.setSerializerCompiler(serializerCompiler)

    fastify.setErrorHandler((error: FastifyError, request, reply) => {

        if (error.statusCode && error.statusCode < 500) {
            return reply.send(error)
        }

        request.log.error(error)

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return reply.code(503).send({ error: 'database unavailable'})
        }

        if (error.code?.startsWith('23')) {
            return reply.code(409).send({ error:  'conflict' })
        }

        return reply.code(500).send({ error: 'internal server error' })
    })

    const ArtistSchema = z.object({
        name: z.string()
    })

    fastify.get('/health', async () => {
        return { status: 'ok' }
    })

    fastify.post('/artists', { 
        schema: { body: ArtistSchema }
    }, async (request, reply) => {
        const result = await pool.query(
            'INSERT INTO artists (name) VALUES ($1) RETURNING *',
            [request.body.name]
        )
        reply.code(201) 
        return result.rows[0]
    })

    return fastify 
}