<template>
  <fieldset class="agenda-item-form">
    <button type="button" class="agenda-item-form__remove-button" @click="$emit('remove')">
      <UiIcon icon="trash" />
    </button>

    <UiFormGroup>
      <UiDropdown v-model="currentItem.type" title="Тип" :options="$options.agendaItemTypeOptions" name="type" />
    </UiFormGroup>

    <div class="agenda-item-form__row">
      <div class="agenda-item-form__col">
        <UiFormGroup label="Начало">
          <UiInput v-model="currentItem.startsAt" type="time" placeholder="00:00" name="startsAt" />
        </UiFormGroup>
      </div>
      <div class="agenda-item-form__col">
        <UiFormGroup label="Окончание">
          <UiInput v-model="currentItem.endsAt" type="time" placeholder="00:00" name="endsAt"  />
        </UiFormGroup>
      </div>
    </div>

    <UiFormGroup v-for="inputData in $options.agendaItemFormSchemas[currentItem.type]" :key="inputData.props.name"
      :label="inputData.label">
      <component :is="inputData.component" v-bind="inputData.props" v-model="currentItem[inputData.props.name]" />
    </UiFormGroup>
  </fieldset>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType, CreateComponentPublicInstance} from "vue";
import UiIcon from './UiIcon.vue';
import UiFormGroup from './UiFormGroup.vue';
import UiInput from './UiInput.vue';
import UiDropdown from './UiDropdown.vue';
import {nanoid} from "nanoid";

interface AgendaItemInterface {
  id: number;
  startsAt: string;
  endsAt: string;
  type: string;
  title: string | null;
  description: string | null;
  speaker: string | null;
  language: string | null;
}

interface MeetupAgendaItemFormInterface {
  currentItem: AgendaItemInterface;
  timeShift: number;
}

interface FormSchemaInterface {
  label: string,
  component: string | CreateComponentPublicInstance,
  props: {
    name: string,
    [key: string]: unknown,
  }
}

type AgendaItemFormSchemaType = Record<string, FormSchemaInterface>;

const agendaItemTypeIcons: Record<string, string> = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

const agendaItemDefaultTitles: Record<string, string> = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

const agendaItemTypeOptions = Object.entries(agendaItemDefaultTitles).map(([type, title]) => ({
  value: type,
  text: title,
  icon: agendaItemTypeIcons[type],
}));

const talkLanguageOptions = [
  { value: null, text: 'Не указано' },
  { value: 'RU', text: 'RU' },
  { value: 'EN', text: 'EN' },
];

const commonAgendaItemFormSchema: AgendaItemFormSchemaType = {
  title: {
    label: 'Нестандартный текст (необязательно)',
    component: 'ui-input',
    props: {
      name: 'title',
    },
  },
};

const agendaItemFormSchemas: Record<string, Record<string, FormSchemaInterface>> = {
  registration: commonAgendaItemFormSchema,
  opening: commonAgendaItemFormSchema,
  talk: {
    title: {
      label: 'Тема',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    speaker: {
      label: 'Докладчик',
      component: 'ui-input',
      props: {
        name: 'speaker',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
    language: {
      label: 'Язык',
      component: 'ui-dropdown',
      props: {
        options: talkLanguageOptions,
        title: 'Язык',
        name: 'language',
      },
    },
  },
  break: commonAgendaItemFormSchema,
  coffee: commonAgendaItemFormSchema,
  closing: commonAgendaItemFormSchema,
  afterparty: commonAgendaItemFormSchema,
  other: {
    title: {
      label: 'Заголовок',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
  },
};

export default defineComponent({
  name: 'MeetupAgendaItemForm',

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  agendaItemTypeOptions,
  agendaItemFormSchemas,
  nanoid,

  props: {
    agendaItem: {
      type: Object as PropType<AgendaItemInterface>,
      required: true,
    },
  },

  emits: ['remove', 'update:agendaItem'],

  data(): MeetupAgendaItemFormInterface {
    return {
      currentItem: {...this.agendaItem},
      timeShift: 0,
    }
  },

  watch: {
    currentItem: {
      deep: true,
      handler() {
        this.$emit('update:agendaItem', {...this.currentItem});
      },
    },
    'currentItem.endsAt': {
      immediate: true,
      handler() {
        const endHour = +this.currentItem.endsAt.substring(0,2);
        const startHour = +this.currentItem.startsAt.substring(0,2)
        this.timeShift = endHour - startHour < 0 ? 24 + endHour - startHour : endHour - startHour;
      },
    },
    'currentItem.startsAt': {
      handler(newValue) {
        let updatedHours = +newValue.substring(0,2) + this.timeShift;

        if (updatedHours > 23) {
          updatedHours = updatedHours - 24;
        }

        this.currentItem.endsAt = newValue.replace(
          newValue.substring(0,2),
          updatedHours < 10 ? `0${updatedHours}`: updatedHours
        );
      },
    },
  },
});
</script>

<style scoped>
.agenda-item-form {
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 20px 10% 0 16px;
}

.agenda-item-form__remove-button {
  position: absolute;
  top: 4px;
  right: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 4px;
  cursor: pointer;
  transition: 0.2s opacity;
}

.agenda-item-form__remove-button:hover {
  opacity: 0.6;
}

.agenda-item-form__row {
  display: flex;
  flex-direction: column;
}

.agenda-item-form__col + .agenda-item-form__col {
  margin-top: 16px;
}

.agenda-item-form__col:first-child {
  margin-left: 0;
}

@media all and (min-width: 992px) {
  .agenda-item-form {
    padding: 28px 25% 4px 24px;
  }

  .agenda-item-form__remove-button {
    top: 20px;
    right: 20px;
  }

  .agenda-item-form__row {
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -12px;
  }

  .agenda-item-form__col {
    flex: 1 1 auto;
    padding: 0 12px;
  }

  .agenda-item-form__col + .agenda-item-form__col {
    margin-top: 0;
  }

  .agenda-item-form__col:first-child {
    margin-left: 0;
  }
}
</style>
