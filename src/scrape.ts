import cheerio from 'cheerio';
import fetch from 'node-fetch';

export interface Tweet {
	id: string;
	imgs: string[];
}

export async function fetchHTML(url: string): Promise<string> {
	const request = await fetch(url);
	return request.text();
}

export function parseHTML(html: string) {
	const $ = cheerio.load(html);
	const tweets: Tweet[] = [];
	$('#stream-items-id .tweet').each((_: number, item: CheerioElement): number => {
		const id = $(item).attr('data-item-id')!;
		const imgs = $(item)
			.find('.AdaptiveMedia-container img')
			.map((_, el) => `${$(el).attr('src')}`)
			.get();
		return tweets.push({ id, imgs });
	});
	return tweets;
}
