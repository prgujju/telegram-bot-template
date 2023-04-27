import { VercelRequest, VercelResponse } from "@vercel/node";
import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { body, query } = req;

    if (query.setWebhook === "true") {
      const webhookUrl = `${BASE_PATH}/api/telegram-hook?secret_hash=${query.secret_hash}`;

      const isSet = await bot.telegram.setWebhook(webhookUrl);
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`);
    }

    if (query.secret_hash) {
    await handleBot(body,query.secret_hash);
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }

  res.status(200).json({status : "Bot Connected"});

};

const BASE_PATH =
  process.env.VERCEL_ENV === "production"
    ? "https://telebot-delta.vercel.app"
    : "https://telegram-bot-jsjoeio.jsjoeio.coder.app";


export async function handleBot(bot,secret_hash){
  console.log(secret_hash);
  
  const botToken = process.env.BOT_TOKEN
  const bot = new Telegraf(botToken);
  await bot.handleUpdate(body);

bot.command("test", async (ctx) => {
  const { message } = ctx;

  let reply = "Hello there! Awaiting your service";

  const didReply = await ctx.reply(reply, {
    reply_to_message_id: message?.message_id,
  });

  if (didReply) {
    console.log(`Reply to command sent successfully.`);
  } else {
    console.error(
      `Something went wrong with the command. Reply not sent.`
    );
  }
});

bot.command("hello", async (ctx) => {
  await ctx.reply("Hello");
});

bot.on("message", async (ctx) => {
  const { message } = ctx;

  const isGroup =
    message?.chat.type === "group" || message?.chat.type === "supergroup";

  if (isGroup) {
    await ctx.reply("This bot is only available in private chats.");
    return;
  }

  const telegramUsername = message?.from?.username;
  const reply = "a message was sent";

  await ctx.reply(reply, {
    reply_to_message_id: message.message_id,
  });
});
}
