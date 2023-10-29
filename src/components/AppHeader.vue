<template>
	<!-- Header -->
	<header id="header" class="bg-gray-700">
		<nav class="container flex items-center justify-start px-4 py-5 mx-auto">
			<!-- App Name -->
			<router-link
				:to="{ name: 'home' }"
				class="mr-4 text-2xl font-bold text-white uppercase"
				exact-active-class="no-active"
				>Music</router-link
			>

			<div class="flex items-center flex-grow">
				<!-- Primary Navigation -->
				<ul class="flex flex-row mt-1">
					<li>
						<router-link class="px-2 text-white" :to="{ name: 'about' }"
							>About</router-link
						>
					</li>

					<!-- Navigation Links -->
					<li v-if="!userStore.userLoggedIn">
						<a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
							>Login / Register</a
						>
					</li>
					<template v-else>
						<li>
							<router-link class="px-2 text-white" :to="{ name: 'manage' }"
								>Manage</router-link
							>
						</li>
						<li>
							<a class="px-2 text-white" href="#" @click.prevent="signOut"
								>Logout</a
							>
						</li>
					</template>
				</ul>
				<ul class="ml-auto">
					<li>
						<a class="px-2 text-white" href="#" @click.prevent="changeLocale">{{
							currentLocale
						}}</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapStores } from 'pinia';
import useModalStore from '@/stores/modal';
import useUserStore from '@/stores/user';

export default {
	name: 'AppHeader',
	computed: {
		...mapStores(useModalStore, useUserStore),
		currentLocale() {
			return this.$i18n.locale === 'ru' ? 'Русский' : 'English ';
		},
	},
	methods: {
		toggleAuthModal() {
			this.modalStore.isOpen = !this.modalStore.isOpen;
		},
		signOut() {
			this.userStore.signOut();
			//   console.log(this.$route);
			if (this.$route.meta.requiresAuth) {
				this.$router.push({ name: 'home' });
			}
		},
		changeLocale() {
			this.$i18n.locale = this.$i18n.locale === 'en' ? 'ru' : 'en';
		},
	},
};
</script>
