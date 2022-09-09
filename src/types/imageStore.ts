type Data = {
	list: {
		id: number
		title: string
		timestamp: string
		date: string
		base64: string
		url: {
			hd: string
			uhd: string
			thumbnail: string
			greyscale: string
			gaussian: string
		}
		color: {
			Muted: string
			Vibrant: string
			LightMuted: string
			LightVibrant: string
			DarkMuted: string
			DarkVibrant: string
		}
	}[]
	totle: number
}

export default Data
