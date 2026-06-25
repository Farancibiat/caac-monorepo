import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** @type {import('eslint').Linter.Config[]} */
const next = require('eslint-config-next')

export default [...next]
