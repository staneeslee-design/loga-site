'use client'
import { makePage } from '../runtime'
import ast from '../templates/legal.json'
import factory from '../logic/legal.js'

const Page = makePage(ast as any, factory)
export default Page
