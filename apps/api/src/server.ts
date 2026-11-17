import Fastify from 'fastify'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider
} from 'fastify-type-provider-zod'

const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()
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

try {
    await fastify.listen({ port: 3002 })
} catch (e) {
    fastify.log.error(e)
    process.exit(1)
}