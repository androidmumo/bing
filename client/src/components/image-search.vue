<script setup lang="ts">
const imageStore = useImageStore()
const { t } = useLanguage()

const form = reactive({
	date: imageStore.filters.date,
	keyword: imageStore.filters.keyword,
})

watch(
	() => [imageStore.filters.date, imageStore.filters.keyword],
	([date, keyword]) => {
		form.date = date
		form.keyword = keyword
	}
)

const submit = () => {
	imageStore.search(form)
}

const clear = () => {
	form.date = ''
	form.keyword = ''
	imageStore.clearSearch()
}
</script>

<template>
	<form class="image-search" @submit.prevent="submit">
		<input
			v-model="form.date"
			class="image-search-date"
			type="date"
			:aria-label="t('index.date')"
		/>
		<input
			v-model="form.keyword"
			class="image-search-keyword"
			type="search"
			:placeholder="t('index.searchPlaceholder')"
			:aria-label="t('index.searchPlaceholder')"
		/>
		<button class="image-search-submit" type="submit">
			{{ t('index.search') }}
		</button>
		<button
			v-if="form.date || form.keyword"
			class="image-search-clear"
			type="button"
			@click="clear"
		>
			{{ t('index.clear') }}
		</button>
	</form>
</template>

<style scoped lang="scss">
.image-search {
	width: 100%;
	margin-top: 16px;
	display: flex;
	align-items: center;
	gap: 10px;
	box-sizing: border-box;

	input,
	button {
		height: 40px;
		box-sizing: border-box;
		border: 1px solid #d8d8dc;
		border-radius: 8px;
		font: inherit;
	}

	input {
		padding: 0 12px;
		color: #121212;
		background: rgba(255, 255, 255, 0.9);
		outline: none;

		&:focus {
			border-color: #603dc1;
			box-shadow: 0 0 0 3px rgba(96, 61, 193, 0.12);
		}
	}

	.image-search-date {
		width: 170px;
	}

	.image-search-keyword {
		min-width: 180px;
		flex: 1;
	}

	button {
		padding: 0 18px;
		cursor: pointer;
	}

	.image-search-submit {
		color: #fff;
		border-color: #603dc1;
		background: #603dc1;
	}

	.image-search-clear {
		color: #555;
		background: transparent;
	}
}

:global(html.dark) .image-search {
	input {
		color: #e5e7eb;
		border-color: #404040;
		background: rgba(32, 32, 32, 0.92);

		&:focus {
			border-color: #858ae3;
			box-shadow: 0 0 0 3px rgba(133, 138, 227, 0.16);
		}
	}

	.image-search-submit {
		color: #121212;
		border-color: #858ae3;
		background: #858ae3;
	}

	.image-search-clear {
		color: #d1d5db;
	}
}

@media (max-width: 640px) {
	.image-search {
		padding: 0 16px;
		flex-wrap: wrap;

		.image-search-date {
			width: 145px;
		}

		.image-search-keyword {
			min-width: 150px;
		}

		button {
			flex: 1;
		}
	}
}
</style>
