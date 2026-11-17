import Fastify from 'fastify'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'

export function buildApp(options = { logger: true }) {

    const fastify = Fastify(options).withTypeProvider<ZodTypeProvider>()
    fastify.setValidatorCompiler(validatorCompiler)
    fastify.setSerializerCompiler(serializerCompiler)

    const ArtistSchema = z.object({
        name: z.string()
    })

    fastify.get('/health', async () => {
        return { status: 'ok' }
    })

    fastify.post('/artists', { 
        schema: { body: ArtistSchema }
    }, async (request, reply) => {
        reply.code(201)
        return request.body
    })

    return fastify 
}