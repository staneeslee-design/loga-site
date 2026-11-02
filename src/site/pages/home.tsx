'use client'
import { makePage } from '../runtime'
import ast from '../templates/home.json'
import factory from '../logic/home.js'

const Page = makePage(ast as any, factory)
export default Page
