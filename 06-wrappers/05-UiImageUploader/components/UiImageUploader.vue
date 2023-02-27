<template>
  <div class="image-uploader">
    <label
      class="image-uploader__preview"
      :class="{
        'image-uploader__preview-loading': status === $options.LoadStatus.LOADING
      }"
      :style="style"
    >
      <span class="image-uploader__text">{{ message }}</span>
      <input
        ref="input"
        v-bind="$attrs"
        type="file"
        accept="image/*"
        class="image-uploader__input"
        @change="onInputChange"
        @click="onInputClick"
      />
    </label>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type { PropType } from 'vue';

enum LoadStatus {
  NOT_LOADED = `NOT_LOADED`,
  LOADING = `LOADING`,
  LOADED = `LOADED`,
}

const MessageText = {
  NOT_LOADED: `Загрузить изображение`,
  LOADING: `Загрузка...`,
  LOADED: `Удалить изображение`
}

interface DataInterface {
  status: LoadStatus;
  imageUrl: string | undefined;
}

export default defineComponent({
  name: 'UiImageUploader',

  inheritAttrs: false,

  LoadStatus,

  props: {
    preview: String as PropType<string>,
    uploader: Function as PropType<Function>,
  },

  emits: ['select', 'error', 'upload', 'remove'],

  data(): DataInterface {
    return {
      status: LoadStatus.NOT_LOADED,
      imageUrl: undefined,
    }
  },

  computed: {
    message(): string {
      return MessageText[this.status];
    },
    image: {
      set(image: string | undefined) {
        this.imageUrl = image;
      },
      get(): string | undefined {
        return this.imageUrl;
      }
    },
    style() {
      return this.status === LoadStatus.LOADED ? `--bg-url: url('${this.image}')` : ``
    }
  },

  beforeMount() {
    this.setInitialImage();
    this.setInitialType();
  },

  methods: {
    setInitialImage() {
      if (this.preview) {
        this.image = this.preview;
      }
    },

    setInitialType() {
      if (this.preview) {
        this.status = LoadStatus.LOADED;
      }
    },

    removeFile(): void {
      this.image = undefined;
      this.$emit('remove');
      (this.$refs.input as HTMLInputElement).value = ``;
      this.status = LoadStatus.NOT_LOADED;
    },

    uploadFileWithoutUploader(file: File): void {
      this.image = URL.createObjectURL(file);
      this.status = LoadStatus.LOADED;
    },

    async uploadFileWithUploader(file: File): Promise<void> {
      this.status = LoadStatus.LOADING;

      try {
        const response = await this.uploader!(file);

        this.$emit('upload', response);

        this.image = response.image;

        this.status = LoadStatus.LOADED;
      } catch(error) {
        this.$emit('error', error);

        (this.$refs.input as HTMLInputElement).value = ``;

        this.status = LoadStatus.NOT_LOADED;
      }
    },

    async onInputChange(evt: Event) {
      const files = (evt.currentTarget as HTMLInputElement).files;

      if (files && files.length > 0) {
        const file = files[0];

        this.$emit('select', file);

        if (!this.uploader) {
          this.uploadFileWithoutUploader(file);
        } else {
          await this.uploadFileWithUploader(file);
        }
      }
    },

    onInputClick(evt: Event) {
      if (this.status === LoadStatus.LOADED) {
        evt.preventDefault();
        this.removeFile();
      }
    }
  },

});
</script>

<style scoped>
.image-uploader {
}

.image-uploader__input {
  opacity: 0;
  height: 0;
}

.image-uploader__preview {
  --bg-url: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-url);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader__text {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
