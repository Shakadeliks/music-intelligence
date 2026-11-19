import type { MigrationBuilder } from 'node-pg-migrate'

export const up = (pgm: MigrationBuilder) => {
    pgm.createTable('artists', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuidv7()')
        },
        name: {
            type: 'text',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()')
        }
    })
};

export const down = (pgm: MigrationBuilder) => {
    pgm.dropTable('artists')
};
