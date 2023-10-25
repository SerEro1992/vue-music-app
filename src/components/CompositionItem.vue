<template>
  <div class="p-3 mb-4 border border-gray-200 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>

      <button
        class="float-right px-2 py-1 ml-1 text-sm text-white bg-red-600 rounded"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>

      <button
        @click.prevent="showForm = !showForm"
        class="float-right px-2 py-1 ml-1 text-sm text-white bg-blue-600 rounded"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>

    <div v-show="showForm">
      <div
        class="p-4 mb-4 font-bold text-center text-white"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="is_submission"
        >
          Submit
        </button>
        <button
          type="button"
          @click.prevent="showForm = false"
          :disabled="in_submission"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { songsCollection, storage } from '@/includes/firebase';
export default {
  name: 'CompositionItem',
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      is_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Пожалуйста, подождите! Обновляем информацию о песне',
    };
  },

  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  components: { ErrorMessage },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Пожалуйста, подождите! Обновляем информацию о песне';

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Что-то не так, ошибка! Повторите попытку';
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Успешно! Поздравляю!';
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();
      await songsCollection.doc(this.song.docID).delete();
      this.removeSong(this.index);
    },
  },
};
</script>
