import test from 'ava'
import {TelegrafContext} from 'telegraf/typings/context'

import {MenuTemplate} from '../../source'

import {resendMenuToContext} from '../../source/send-menu'

test('resend on callback query', async t => {
	t.plan(4)
	const menu = new MenuTemplate<TelegrafContext>('whatever')

	const fakeContext: Partial<TelegrafContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666'
		},
		answerCbQuery: async text => {
			t.is(text, undefined)
			return Promise.resolve(true)
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		reply: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: []
				}
			})
			return Promise.resolve(undefined as any)
		}
	}

	await resendMenuToContext(menu, fakeContext as any, '/')
})

test('resend on whatever', async t => {
	t.plan(3)
	const menu = new MenuTemplate<TelegrafContext>('whatever')

	const fakeContext: Partial<TelegrafContext> = {
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		reply: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: []
				}
			})
			return Promise.resolve(undefined as any)
		}
	}

	await resendMenuToContext(menu, fakeContext as any, '/')
})
