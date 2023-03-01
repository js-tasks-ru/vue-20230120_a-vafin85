<template>
  <form
    class="meetup-form"
    @submit.prevent="$emit('submit', $options.klona(currentMeetup))"
  >
    <div class="meetup-form__content">
      <fieldset class="meetup-form__section">
        <UiFormGroup label="Название">
          <UiInput v-model="currentMeetup.title" name="title" />
        </UiFormGroup>
        <UiFormGroup label="Дата">
          <UiInputDate v-model="currentMeetup.date" type="date" name="date" />
        </UiFormGroup>
        <UiFormGroup label="Место">
          <UiInput v-model="currentMeetup.place" name="place" />
        </UiFormGroup>
        <UiFormGroup label="Описание">
          <UiInput v-model="currentMeetup.description" multiline rows="3" name="description" />
        </UiFormGroup>
        <UiFormGroup label="Изображение">
          <!--
               Предлагается сохранять файл для будущей загрузки во временное поле imageToUpload
               и передавать в объекте со всеми данными формы
          -->
          <ui-image-uploader
            name="image"
            :preview="currentMeetup.image"
            @select="currentMeetup.imageToUpload = $event"
            @remove="currentMeetup.imageToUpload = null"
          />
        </UiFormGroup>
      </fieldset>

      <h3 class="meetup-form__agenda-title">Программа</h3>

      <meetup-agenda-item-form
        v-for="(agendaItem, index) in currentMeetup.agenda"
        :key="agendaItem.id"
        v-model:agenda-item="currentMeetup.agenda[index]"
        class="meetup-form__agenda-item"
        @remove="removeAgendaItem(index)"
      />

      <div class="meetup-form__append">
        <button
          class="meetup-form__append-button"
          type="button"
          data-test="addAgendaItem"
          @click="addAgendaItem"
        >
          + Добавить этап программы
        </button>
      </div>
    </div>

    <div class="meetup-form__aside">
      <div class="meetup-form__aside-stick">
        <!-- data-test атрибуты используются для поиска нужного элемента в тестах, не удаляйте их -->
        <ui-button
          data-test="cancel"
          variant="secondary"
          block
          class="meetup-form__aside-button"
          @click="$emit('cancel')"
        >
          Отмена
        </ui-button>
        <ui-button
          variant="primary"
          block
          class="meetup-form__aside-button"
          data-test="submit"
          type="submit"
        >
          {{ submitText }}
        </ui-button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import MeetupAgendaItemForm from './MeetupAgendaItemForm.vue';
import UiButton from './UiButton.vue';
import UiFormGroup from './UiFormGroup.vue';
import UiInput from './UiInput.vue';
import UiInputDate from './UiInputDate.vue';
import { createAgendaItem } from '../meetupService.js';
import {klona} from "klona";
import {defineComponent} from "vue";
import type {PropType} from "vue";
import UiImageUploader from "../../../06-wrappers/05-UiImageUploader/components/UiImageUploader.vue";

interface MeetupInterface {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;
  place: string;
  agenda: AgendaItemInterface[];
  imageToUpload?: string | null;
}

export interface AgendaItemInterface {
  id: number;
  startsAt: string;
  endsAt: string;
  type: string;
  title: string | null;
  description: string | null;
  speaker: string | null;
  language: string | null;
}

interface MeetupFormDateInterface {
  currentMeetup: MeetupInterface;
}

export default defineComponent({
  name: 'MeetupForm',

  klona,

  components: {
    MeetupAgendaItemForm,
    UiButton,
    UiFormGroup,
    UiImageUploader,
    UiInput,
    UiInputDate,
  },

  props: {
    meetup: {
      type: Object as PropType<MeetupInterface>,
      required: true,
    },

    submitText: {
      type: String as PropType<string>,
      default: '',
    },
  },

  emits: ['cancel', 'submit'],

  data(): MeetupFormDateInterface {
    return {
      currentMeetup: klona(this.meetup),
    }
  },

  methods: {
    addAgendaItem() {
      const newItem = createAgendaItem();
      newItem.startsAt = this.currentMeetup.agenda.length ?  this.currentMeetup.agenda[this.currentMeetup.agenda.length - 1].endsAt : newItem.startsAt;
      this.currentMeetup.agenda.push(newItem);
    },
    removeAgendaItem(index: number) {
      this.currentMeetup.agenda.splice(index, 1);
    },
  },
});
</script>

<style scoped>
.meetup-form__section {
  border: none;
}

.meetup-form__agenda-title {
  font-weight: 700;
  font-size: 28px;
  line-height: 150%;
  color: var(--body-color);
  margin: 0 0 24px 0;
}

.meetup-form__aside {
  margin: 48px 0;
}

.meetup-form__aside-button {
  margin: 0 0 12px 0;
}

.meetup-form__agenda-item + .meetup-form__agenda-item {
  margin-top: 24px;
}

.meetup-form__append {
  margin-top: 24px;
}

.meetup-form__append-button {
  box-shadow: none;
  border: none;
  background-color: transparent;
  padding: 0;
  outline: none;
  color: var(--blue);
  cursor: pointer;
  font-size: 20px;
  line-height: 28px;
}

.meetup-form__append-button:hover {
  text-decoration: underline;
}

@media all and (min-width: 992px) {
  .meetup-form {
    display: flex;
    flex-direction: row;
  }

  .meetup-form__content {
    flex: 1 0 calc(100% - 320px);
  }

  .meetup-form__aside {
    flex: 1 0 320px;
    max-width: 320px;
    width: 100%;
    padding-left: 137px;
    margin: 0;
  }

  .meetup-form__aside-stick {
    position: sticky;
    top: 32px;
  }
}
</style>
