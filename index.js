const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5756643650:AAEA7lEWB1eKgvb3HOufioZt2B5xn8S8HJ8";

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands([
  { command: "/start", description: "Starting message" },
  { command: "/info", description: "Info about you" },
  { command: "/game", description: "Play game" },
]);
const startGame = async (chatId) => {
  await bot.sendMessage(chatId, ` Guess number from 0 to 9`);
  const randNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randNumber;
  await bot.sendMessage(chatId, `Guess my number`, gameOptions);
};

const stickers = [
  {
    id: 1,
    img: "https://tlgrm.eu/_/stickers/a31/8c6/a318c687-06ef-4e2a-a048-60da2b859b4d/192/5.webp",
  },
  {
    id: 2,
    img: "https://tlgrm.eu/_/stickers/a31/8c6/a318c687-06ef-4e2a-a048-60da2b859b4d/192/6.webp",
  },
  {
    id: 3,
    img: "https://tlgrm.eu/_/stickers/a31/8c6/a318c687-06ef-4e2a-a048-60da2b859b4d/192/11.webp",
  },
];

const chats = {};
function randomSticker() {
  let img = Math.floor(Math.random() * 10);
  let sticker = stickers.find((el) => {
    return el.id == img;
  });
  return sticker.img;
}

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, "Welcome to PingOcean bot");
    }
    if (text === "/info") {
      await bot.sendSticker(chatId, randomSticker());
      return bot.sendMessage(
        chatId,
        `Your name ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(
      chatId,
      " Sorry, i dont understand you, please write me again"
    );
  });
  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;
    if (data === "/again") {
      return startGame(chatId);
    }
    console.log(
      "🚀 ~ file: index.js ~ line 99 ~ bot.on ~ chats[chatId]",
      chats[chatId]
    );
    console.log("🚀 ~ file: index.js ~ line 103 ~ bot.on ~ data", data);
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        ` congrulate, yo guess number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        ` you looseк, bot guess number ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
