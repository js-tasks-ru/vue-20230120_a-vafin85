# refHistory

👷🏻 _Задача нормальной сложности_\
📚 _Закрепление материала_

<!--start_statement-->

Требуется реализовать функцию `refHistory` для отслеживания истории изменения реактивного значения.

- Параметр функции:
  - `source` - исходное реактивное значение (`ref`)
- Возвращаемое значение:
  - Объект `{ history }`, где `history` - `ref` с массивом значений `source`.

При изменении значения исходной реактивной переменной `source`, в `history` должно сразу **синхронно** добавляться новое
значение.

Глубокого отслеживания не требуется, только изменение непосредственно `value`.

Для синхронного отслеживания требуется менять свойство отслеживания `flush`, либо использовать специальные функции
отслеживания.

Возвращать предлагается именно объект, так как это позволит в будущем проще добавить новую функциональность в утилиту,
например, методы `undo`, `redo` работы с историей.

```javascript
// Пример

const foo = ref(0);
foo.value = 1;

const { history } = refHistory(foo); // Начальное значение - 1

console.log(history.value); // [1]

foo.value = 2;
foo.value = 3;

// История обновилась синхронно, без необходимости ждать nextTick()
console.log(history.value); // [1, 2, 3]
```

<img src="https://i.imgur.com/SR8nk0l.gif" alt="Example" />

<!--end_statement-->

---

### Инструкция

📝 Для решения задачи отредактируйте файл: `utils/refHistory.js`.

🚀 Команда запуска для ручного тестирования: `npm run serve`;\
приложение будет доступно на [http://localhost:8080/08-reactivity/03-refHistory/](http://localhost:8080/08-reactivity/03-refHistory/).

✅ Доступно автоматическое тестирование: `npm test refHistory`.