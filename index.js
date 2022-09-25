const axios = require("axios");
const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions, linkOptions } = require("./options");
const token = "5756643650:AAEA7lEWB1eKgvb3HOufioZt2B5xn8S8HJ8";
const baseURL = "https://api.hh.ru";

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands([
  { command: "/start", description: "Starting message" },
  { command: "/info", description: "Info about you" },
  { command: "/game", description: "Play game" },
  //   { command: "/zabira", description: "Pick me" },
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
  {
    id: 4,
    img: "https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/256/5.webp",
  },
  {
    id: 5,
    img: "https://tlgrm.eu/_/stickers/928/127/92812700-8f50-42c9-aedc-0976133103d7/256/19.webp",
  },
  {
    id: 6,
    img: "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.webp",
  },
  {
    id: 7,
    img: "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/6.webp",
  },
  {
    id: 8,
    img: "https://tlgrm.eu/_/stickers/ffb/53d/ffb53d6e-399a-48f2-b798-586605cbb536/4.webp",
  },
  {
    id: 9,
    img: "https://tlgrm.eu/_/stickers/c36/1c0/c361c044-f105-45f1-ba01-33626dfc1d57/256/9.webp",
  },
  {
    id: 0,
    img: "https://tlgrm.eu/_/stickers/c36/1c0/c361c044-f105-45f1-ba01-33626dfc1d57/256/9.webp",
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
const goToVac = (item) => {
  const btn = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: `link`,
            url: `${item.alternate_url}`,
          },
        ],
      ],
    }),
  };
  return btn;
};
const start = () => {
  bot.on("message", async (msg) => {
    console.log("🚀 ~ file: index.js ~ line 72 ~ bot.on ~ msg", msg);
    const text = msg.text;
    const chatId = msg.chat.id;
    const replacer = (item) => {
      return item.replace(/<highlighttext>|<\/highlighttext>/g, "");
    };
    const render = (el) => {
      const str = replacer(el.snippet.requirement);
      const resStr = replacer(el.snippet.responsibility);
      const ObjCheck = (el) => {
        console.log("🚀 ~ file: index.js ~ line 99 ~ ObjCheck ~ el", el);
        let obj = {};
        obj.name = el.hasOwnProperty(el.name) ? "not data" : el.name;
        obj.company = el.hasOwnProperty(el.employer.name)
          ? "not data"
          : el.employer.name;
        obj.address = el.hasOwnProperty(el.area.name)
          ? "not data"
          : el.area.name;
        obj.salaryFrom = el.hasOwnProperty(el.salary.from)
          ? "not data"
          : el.salary.from;
        obj.salaryTo = el.hasOwnProperty(el.salary.to)
          ? "not data"
          : el.salary.to;
        obj.salaryCur = el.hasOwnProperty(el.salary.currency)
          ? "not data"
          : el.salary.currency;
        obj.requirement = str ? str : "not data";
        obj.responsibility = resStr ? resStr : "not data";
        return obj;
      };

      const objVac = ObjCheck(el);
      const vac = `
name: ${objVac.name},
address: ${objVac.address},
company: ${objVac.company},
salary: ${objVac.salaryFrom}-${objVac.salaryTo} ${objVac.salaryCur},
requirement: ${objVac.requirement},
responsibility: ${objVac.responsibility}
`;
      return bot.sendMessage(chatId, vac, goToVac(el));
    };
    if (text === "/jobs") {
      axios
        .get("https://api.hh.ru/vacancies", {
          headers: {
            "HH-User-Agent": "my-app-vladik7221@gmail.com",
          },
          params: {
            text: "Frontend developer Vue",
            schedule: "remote",
          },
        })
        .then((res) => {
          const arrVac = res.data.items;
          const vacancies = new Set();
          arrVac.forEach((el) => {
            vacancies.add(el);
            console.log(el, "elem");

            if (vacancies.has(el)) {
              console.log("succes unique item");
              //   vacancies.push(el);
              render(el);
            }
          });
          //   vacancies.forEach((el) => {
          //     console.log("render vac");
          //     render(el)
          //   });
        })
        .catch((err) => console.error(err));
    }
    if (text === "/start") {
      return bot.sendMessage(chatId, "Welcome to PingOcean bot");
    }
    if (text === "/info") {
      await bot.sendSticker(chatId, randomSticker());
      if (msg.from.last_name == undefined) {
        return bot.sendMessage(
          chatId,
          `Your name ${msg.from.first_name}, chort suka, napishi familiyu`
        );
      }
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
setInterval(() => {
  start();
}, 300000);
