<script setup lang="ts">
const imageStore = useImageStore()
const { t } = useLanguage()

const isOpen = ref(false)
const keywordInput = ref<HTMLInputElement>()
const form = reactive({
	date: imageStore.filters.date,
	keyword: imageStore.filters.keyword,
})

const hasFilters = computed(() =>
	Boolean(imageStore.filters.date || imageStore.filters.keyword)
)

const open = () => {
	form.date = imageStore.filters.date
	form.keyword = imageStore.filters.keyword
	isOpen.value = true
	nextTick(() => keywordInput.value?.focus())
}

const close = () => {
	isOpen.value = false
}

const submit = () => {
	imageStore.search(form)
	close()
}

const clear = () => {
	form.date = ''
	form.keyword = ''
	imageStore.clearSearch()
	close()
}

const onKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && isOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
	<div class="image-search">
		<button
			class="image-search-trigger"
			type="button"
			:class="{ active: hasFilters }"
			:aria-label="t('index.search')"
			@click="open"
		>
			<i-carbon:search />
			<span v-if="hasFilters" class="filter-dot"></span>
		</button>

		<Teleport to="body">
			<Transition name="search-panel">
				<div v-if="isOpen" class="image-search-layer" @click.self="close">
					<section
						class="image-search-panel"
						role="dialog"
						aria-modal="true"
						:aria-label="t('index.searchTitle')"
					>
						<div class="panel-header">
							<span>{{ t('index.searchTitle') }}</span>
							<button
								class="panel-close"
								type="button"
								:aria-label="t('index.close')"
								@click="close"
							>
								<i-carbon:close />
							</button>
						</div>

						<form @submit.prevent="submit">
							<label>
								<span>{{ t('index.date') }}</span>
								<input v-model="form.date" type="date" />
							</label>
							<label>
								<span>{{ t('index.keyword') }}</span>
								<input
									ref="keywordInput"
									v-model="form.keyword"
									type="search"
									:placeholder="t('index.searchPlaceholder')"
								/>
							</label>
							<div class="panel-actions">
								<button
									v-if="form.date || form.keyword || hasFilters"
									class="clear"
									type="button"
									@click="clear"
								>
									{{ t('index.clear') }}
								</button>
								<button class="submit" type="submit">
									<i-carbon:search />
									{{ t('index.search') }}
								</button>
							</div>
						</form>
					</section>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped lang="scss">
.image-search {
	height: 32px;
	margin-right: 22px;
	display: flex;
	align-items: center;
}

button {
	font: inherit;
}

.image-search-trigger {
	width: 32px;
	height: 32px;
	padding: 0;
	position: relative;
	display: grid;
	place-items: center;
	color: inherit;
	border: 0;
	border-radius: 50%;
	background: transparent;
	cursor: pointer;
	transition: background-color 0.2s, transform 0.2s;

	&:hover {
		background: rgba(96, 61, 193, 0.1);
	}

	&:active {
		transform: scale(0.9);
	}

	svg {
		font-size: 18px;
	}

	.filter-dot {
		width: 6px;
		height: 6px;
		position: absolute;
		top: 4px;
		right: 4px;
		border: 2px solid #fff;
		border-radius: 50%;
		background: #603dc1;
	}
}

.image-search-layer {
	position: fixed;
	z-index: 20;
	inset: 0;
	background: rgba(18, 18, 18, 0.14);
}

.image-search-panel {
	width: min(420px, calc(100vw - 32px));
	padding: 18px;
	position: absolute;
	top: 70px;
	right: 30px;
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.08);
	border-radius: 16px;
	color: #121212;
	background: rgba(255, 255, 255, 0.96);
	box-shadow: 0 18px 48px rgba(18, 18, 18, 0.16);
	-webkit-backdrop-filter: blur(24px);
	backdrop-filter: blur(24px);

	.panel-header {
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		font-weight: 600;
	}

	.panel-close {
		width: 30px;
		height: 30px;
		padding: 0;
		display: grid;
		place-items: center;
		color: inherit;
		border: 0;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.05);
		cursor: pointer;
	}

	form {
		display: grid;
		gap: 14px;
	}

	label {
		display: grid;
		gap: 7px;
		color: #68686f;
		font-size: 12px;
	}

	input {
		width: 100%;
		height: 42px;
		padding: 0 12px;
		box-sizing: border-box;
		color: #121212;
		border: 1px solid #dedee3;
		border-radius: 10px;
		background: #fff;
		outline: none;
		font: inherit;

		&:focus {
			border-color: #603dc1;
			box-shadow: 0 0 0 3px rgba(96, 61, 193, 0.12);
		}
	}

	.panel-actions {
		margin-top: 2px;
		display: flex;
		justify-content: flex-end;
		gap: 10px;

		button {
			height: 38px;
			padding: 0 16px;
			border-radius: 9px;
			cursor: pointer;
		}

		.clear {
			color: #555;
			border: 1px solid #dedee3;
			background: transparent;
		}

		.submit {
			display: flex;
			align-items: center;
			gap: 7px;
			color: #fff;
			border: 1px solid #603dc1;
			background: #603dc1;
		}
	}
}

.search-panel-enter-active,
.search-panel-leave-active {
	transition: opacity 0.18s ease;

	.image-search-panel {
		transition: transform 0.18s ease, opacity 0.18s ease;
	}
}

.search-panel-enter-from,
.search-panel-leave-to {
	opacity: 0;

	.image-search-panel {
		opacity: 0;
		transform: translateY(-8px) scale(0.98);
	}
}

:global(html.dark) {
	.image-search-trigger {
		&:hover {
			background: rgba(133, 138, 227, 0.16);
		}

		.filter-dot {
			border-color: #121212;
			background: #858ae3;
		}
	}

	.image-search-layer {
		background: rgba(0, 0, 0, 0.28);
	}

	.image-search-panel {
		color: #e5e7eb;
		border-color: rgba(255, 255, 255, 0.1);
		background: rgba(25, 25, 27, 0.96);
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.36);

		.panel-close {
			background: rgba(255, 255, 255, 0.08);
		}

		label {
			color: #a7a7ae;
		}

		input {
			color: #e5e7eb;
			border-color: #414147;
			background: #242428;

			&:focus {
				border-color: #858ae3;
				box-shadow: 0 0 0 3px rgba(133, 138, 227, 0.16);
			}
		}

		.panel-actions {
			.clear {
				color: #d1d5db;
				border-color: #414147;
			}

			.submit {
				color: #121212;
				border-color: #858ae3;
				background: #858ae3;
			}
		}
	}
}

@media (max-width: 640px) {
	.image-search {
		margin-right: 12px;
	}

	.image-search-panel {
		top: 58px;
		right: 12px;
		width: calc(100vw - 24px);
		padding: 16px;
		border-radius: 14px;
	}
}
</style>
