import { Client, TextChannel } from 'discord.js';
import { fetchHTML, parseHTML } from './scrape';

const USER_URL = 'https://twitter.com/PossumEveryHour';
const client = new Client();
const tweets: string[] = [];

async function fetchTweets() {
	const html = await fetchHTML(USER_URL);
	const parsed = parseHTML(html);
	if (!tweets.length) for (const tweet of parsed) tweets.push(tweet.id);
	const newtweet = parsed.find(f => !tweets.includes(f.id));
	if (newtweet && newtweet.imgs.length) {
		tweets.push(newtweet.id);
		const channels = client.channels.cache.filter(c => c instanceof TextChannel && c.name.includes('hourly-possum'));
		if (channels.size) {
			const promises = channels.map(c => (c as TextChannel).send({ files: [newtweet.imgs[0]] }));
			await Promise.all(promises);
		}
	}
}

client.on('ready', async () => {
	console.info(`[READY]: ${client.user?.tag} (${client.user?.id}) is ready!`);
	client.user?.setActivity('how to use => fyko.net/hourlypossum');

	await fetchTweets();
	client.setInterval(() => fetchTweets(), 1000 * 60 * 2);
});

client.login();
