import { VercelRequest, VercelResponse } from "@vercel/node"
import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
export var BOT_TOKEN = ''
export var secret = ""
const bot = new Telegraf(BOT_TOKEN)
export async function handleSecret(secret) {
//BOT_TOKEN = process.env.BOT_TOKEN
secret = secret
BOT_TOKEN = await process.env.BOT_TOKEN
//console.log("Its From Fumction",secret)
}
console.log("Its From Overall" , BOT_TOKEN)

const SECRET_HASH = "32e58fbahey833349df3383dc910e180"
// Note: change to false when running locally
const BASE_PATH =
  process.env.VERCEL_ENV === "production"
    ? "https://telebot-delta.vercel.app"
    : "https://telegram-bot-jsjoeio.jsjoeio.coder.app"


export async function handleTestCommand(ctx: TelegrafContext) {
  const COMMAND = "/test"
  const { message } = ctx

  let reply = "Hello there! Awaiting your service"

  const didReply = await ctx.reply(reply, {
    reply_to_message_id: message?.message_id,
  })

  if (didReply) {
    console.log(`Reply to ${COMMAND} command sent successfully.`)
  } else {
    console.error(
      `Something went wrong with the ${COMMAND} command. Reply not sent.`
    )
  }
}
export async function handleOnMessage(ctx: TelegrafContext) {
  const { message } = ctx

  const isGroup =
    message?.chat.type === "group" || message?.chat.type === "supergroup"

  if (isGroup) {
    await ctx.reply("This bot is only available in private chats.")
    return
  }

  const telegramUsername = message?.from?.username
  const reply = "a message was sent"

  await ctx.reply(reply, {
    reply_to_message_id: message.message_id,
  })
}

bot.command("test", async (ctx) => {
  await handleTestCommand(ctx)
})
bot.command("hello", async (ctx) => {
  await ctx.reply('Hello')
})

bot.on("message", async (ctx) => {
  await handleOnMessage(ctx)
})

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Retrieve the POST request body that gets sent from Telegram
    const { body, query } = req

    if (query.setWebhook === "true") {
      const webhookUrl = `${BASE_PATH}/api/telegram-hook?secret_hash=${SECRET_HASH}`

      // Would be nice to somehow do this in a build file or something
      const isSet = await bot.telegram.setWebhook(webhookUrl)
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`)
    }

    if (query.secret_hash === SECRET_HASH) {
console.log(body)
let bss = {
  update_id: 567548289,
  message: {
    message_id: 1084,
    from: {
      id: 1095232231,
      is_bot: false,
      first_name: 'Rajkumar Parmar',
      last_name: '〄',
      username: 'Sweet_banna',
      language_code: 'en'
    },
    chat: {
      id: 1095232231,
      first_name: 'Rajkumar Parmar',
      last_name: '〄',
      username: 'Sweet_banna',
      type: 'private'
    },
    date: 1682530772,
    text: 'x'
  }
}

      await bot.handleUpdate(bss)
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message")
    console.log(error.toString())
  }

  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  res.status(200).send("OK")
}
