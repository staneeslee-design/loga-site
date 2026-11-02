'use client'
import { makePage } from '../runtime'
import ast from '../templates/engines.json'
import factory from '../logic/engines.js'

const Page = makePage(ast as any, factory)
export default Page
