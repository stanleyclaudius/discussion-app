import { ChangeEvent, FormEvent } from 'react'

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export type FormSubmit = FormEvent<HTMLFormElement>