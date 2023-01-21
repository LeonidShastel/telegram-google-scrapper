require("dotenv").config({path: "./.env"});
const gPlay = require("google-play-scraper");
const {Telegraf} = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN)

const getSubjects = async (country, lang, term)=>{
    try{
        return await gPlay.suggest({country, lang, term})
    }
    catch (e) {
        return [e.message]
    }
};

bot.on("text", async ctx=>{
    try{
        const params = ctx.message.text.toString().split(", ");
        if(params.length!==3){
            await ctx.reply("Неверное количество параметров");
            return;
        }

        const subjects = await getSubjects(params[0], params[1], params[2]);
        ctx.reply(subjects.join("\n"));
    }
    catch (e) {
        await ctx.reply("Ошибка обработки: "+e.message);
    }
});

bot.start(async ctx=>{
    try{
        await ctx.reply("Введите запрос в формате: страна, язык, ключ");
    }
    catch (e) {
        console.log(e.message);
    }
})

(async ()=>{
    await bot.launch();
})();