'use client'
import { makePage } from '../runtime'
import ast from '../templates/cars.json'
import factory from '../logic/cars.js'

const Page = makePage(ast as any, factory)
export default Page
