<template>
	<main>
		<!-- Introduction -->
		<section class="relative py-20 mb-8 text-center text-white">
			<div
				class="absolute inset-0 w-full h-full bg-contain introduction-bg md:bg-cover"
				style="background-image: url('/assets/img/header.png')"
			></div>
			<div class="container mx-auto">
				<div class="text-white main-header-content">
					<h1 class="mb-5 text-5xl font-bold md:text-3xl">
						{{ $t('home.listen') }}
					</h1>
					<p class="w-full mx-auto md:w-8/12 md:text-sm">
						Music - это бесплатный сервис для независимых музыкантов и артистов
						по всему миру. С помощью Music вы можете продвигать свою музыку, как
						хотите, когда хотите, с помощью встраиваемых музыкальных плееров.
					</p>
				</div>
			</div>

			<img
				class="relative block max-w-full mx-auto mt-5 -mb-20 mw-auto"
				src="/assets/img/introduction-music.png"
			/>
		</section>

		<!-- Main Content -->
		<section class="container mx-auto">
			<div
				class="relative flex flex-col bg-white border border-gray-200 rounded"
			>
				<div
					class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
					v-icon-secondary="{ icon: 'headphones-alt', right: true }"
				>
					<span class="card-title">Songs </span>
					<!-- Icon -->
				</div>
				<!-- Playlist -->
				<ol id="playlist">
					<app-song-item v-for="song in songs" :key="song.docID" :song="song" />
				</ol>
				<!-- .. end Playlist -->
			</div>
		</section>
	</main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import AppSongItem from '@/components/SongItem.vue';
import IconSecondary from '@/directives/icon-secondary.js';

export default {
	name: 'Home',
	components: { AppSongItem },
	directives: {
		'icon-secondary': IconSecondary,
	},
	data() {
		return {
			songs: [],
			maxPerPage: 5,
			pendingRequest: false,
		};
	},
	async created() {
		this.getSongs();

		window.addEventListener('scroll', this.handleScroll);
	},
	beforeUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	},
	methods: {
		handleScroll() {
			const { scrollTop, offsetHeight } = document.documentElement;
			const { innerHeight } = window;
			// Alternative (less strict)
			// const bottomOfWindow =
			//   Math.round(scrollTop) + innerHeight > offsetHeight - 100;
			const bottomOfWindow =
				Math.round(scrollTop) + innerHeight === offsetHeight;

			if (bottomOfWindow) {
				this.getSongs();
			}
		},
		async getSongs() {
			if (this.pendingRequest) {
				return;
			}

			this.pendingRequest = true;

			let snapshots;
			if (this.songs.length) {
				const lastDoc = await songsCollection
					.doc(this.songs[this.songs.length - 1].docID)
					.get();
				snapshots = await songsCollection
					.orderBy('modified_name')
					.startAfter(lastDoc)
					.limit(this.maxPerPage)
					.get();
			} else {
				snapshots = await songsCollection
					.orderBy('modified_name')
					.limit(this.maxPerPage)
					.get();
			}

			snapshots.forEach((document) => {
				this.songs.push({
					docID: document.id,
					...document.data(),
				});
			});
			this.pendingRequest = false;
		},
	},
};
</script>
