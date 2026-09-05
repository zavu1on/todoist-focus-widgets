# react-native-android-widget — ресёрч

> Основано только на официальной документации [react-native-android-widget](https://saleksovski.github.io/react-native-android-widget/docs) и исходном коде пакета [sAleksovski/react-native-android-widget](https://github.com/sAleksovski/react-native-android-widget) (проверено на версии `0.22.1`)


## Суть библиотеки

Библиотека позволяет описывать Android-виджет React-компонентами (`FlexWidget`, `ListWidget`, `TextWidget` и т.д.), не трогая нативный код напрямую. Но это **не** «React-рендер внутри `RemoteViews`» в привычном смысле — виджет не хранит живое дерево компонентов и не умеет частичный ре-рендер. Каждое обновление — это полный пересчёт JSX в JS, сериализация в JSON-дерево и одна нативная команда «перерисуй виджет с этим `widgetId` вот этим деревом». Экземпляр виджета (`widgetId`) при этом не пересоздаётся — обновляется его содержимое


## Архитектура рендера

1. JS-код строит JSX (`<FlexWidget>...</FlexWidget>`)
2. `buildWidgetTree()` (`src/api/build-widget-tree.ts`) обходит JSX-дерево и конвертирует его в сериализуемый `WidgetTree`: `{ type, props, children }`, где <u>type</u> — один из `FlexWidget | IconWidget | ImageWidget | ListWidget | OverlapWidget | SvgWidget | TextWidget`
3. Хуки (`useState`, `useEffect`) в дереве виджета **не поддерживаются** — при их обнаружении бросается ошибка `Invalid Hook Call` с подсказкой добавить `"use no memo"` для React Compiler
4. Готовый `WidgetTree` передаётся в нативный модуль: `AndroidWidget.drawWidgetById(config, widgetName, widgetId)`, где <u>config</u> — `{ light, dark }` (поддержка тёмной темы через отдельное дерево)
5. Нативная сторона превращает дерево в `RemoteViews`. По документации раздела Limitations, часть контента (то, что нельзя выразить через `RemoteViews` напрямую) рендерится через промежуточный битмап — "render the React Native views to an image, and then show that image in the widget" — поэтому у виджета нет полноценного DOM/layout-движка Android, а есть его эмуляция через `RemoteViews` + изображения
6. Исключение — `ListWidget`: это не картинка, а нативный скроллящийся список, обслуживаемый Android-сервисом `RNWidgetCollectionService` (`BIND_REMOTEVIEWS`, регистрируется в `AndroidManifest.xml` через provider). Отсюда ограничения из `build-widget-tree.ts`: `ListWidget` нельзя вкладывать в `ListWidget`, и на одном виджете допустимо максимум два `ListWidget`

Важно: **не существует единого списка всех виджетов, из которого идёт общий ре-рендер**. Каждый экземпляр виджета — самостоятельная единица с собственным `widgetId`. JS явно перечисляет нужные экземпляры (через `getWidgetInfo`) и явно шлёт `drawWidgetById` на каждый — это pull-модель на стороне приложения, а не push/реактивная синхронизация со стороны библиотеки


## Регистрация виджета (провайдер)

Нативная сторона — стандартный Android AppWidget:

- Kotlin/Java-класс, наследующий `RNWidgetProvider` (обёртка над `AppWidgetProvider`)
- XML-конфигурация виджета (`android/app/src/main/res/xml/widgetprovider_*.xml`) с атрибутами `minWidth`, `minHeight`, `updatePeriodMillis`, `resizeMode`, `previewImage`, `description`
- `<receiver>` в `AndroidManifest.xml`, слушающий `android.appwidget.action.APPWIDGET_UPDATE` и кастомный `<package>.WIDGET_CLICK`
- Для виджетов со `ListWidget` — дополнительно `<service>` c `RNWidgetCollectionService`

В `src/config-plugin.type.ts` и `app.plugin.js` пакета есть Expo config plugin — значит эта нативная генерация (манифест, XML, provider-классы) настраивается декларативно через `app.json`/`app.config.*` и работает через Continuous Native Generation, без ручной правки `android/` (что важно, так как в этом репозитории есть общее правило "не редактировать `android/`/`ios/` вручную", см. [`../AGENTS.md`](../AGENTS.md))


## Обработчик событий (Task Handler)

Все жизненные события виджета проходят через один headless-обработчик:

```typescript
import { registerWidgetTaskHandler } from 'react-native-android-widget';

registerWidgetTaskHandler(async (props) => {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      props.renderWidget(<MyWidget />);
      break;
    case 'WIDGET_DELETED':
      // renderWidget здесь no-op — библиотека сама это гарантирует
      break;
  }
});
```

Регистрируется один раз в точке входа (`index.js`/`index.ts`) через `AppRegistry.registerHeadlessTask` — то есть это **Headless JS-задача**: Android поднимает JS-движок и выполняет её в фоне даже если приложение не запущено (аналогично фоновой обработке push-уведомлений в RN)

Пять значений <u>widgetAction</u> (тип `NativeTaskInfo` в `src/api/register-widget-task-handler.tsx`) перекрывают весь жизненный цикл, который нужен в вопросе:

| widgetAction | Когда приходит |
|---|---|
| `WIDGET_ADDED` | пользователь добавил виджет на экран |
| `WIDGET_UPDATE` | плановое обновление по `updatePeriodMillis`, либо вызов `requestWidgetUpdate`/нативного `RNWidgetJsCommunication.requestWidgetUpdate` |
| `WIDGET_RESIZED` | пользователь изменил размер виджета (`resizeMode`) |
| `WIDGET_DELETED` | виджет удалён с экрана |
| `WIDGET_CLICK` | клик по элементу с `clickAction` |

Все пять событий **перехватываются полностью** — библиотека не пропускает ни одного мимо этого единственного обработчика, и в каждом можно выполнить произвольную JS-логику (запрос к API, чтение SQLite и т.д.) до вызова `renderWidget`

`props.widgetInfo` (`WidgetInfo` из `src/api/types.ts`) даёт контекст без дополнительных запросов: <u>widgetName</u>, <u>widgetId</u>, <u>width</u>, <u>height</u>, <u>screenInfo</u> (`screenWidthDp/HeightDp`, `density`, `densityDpi`)


## Обновление состояния без пересоздания виджета

Три независимых канала, все ведут к одному и тому же нативному вызову `drawWidgetById` — то есть обновляют содержимое существующего `widgetId`, не создавая новый:

1. **`updatePeriodMillis`** — родной Android-механизм, задаётся в XML провайдера. Ограничение — системное, не библиотечное: Android не доставляет такие обновления чаще раза в 30 минут. Триггерит `WIDGET_UPDATE` в task handler
2. **`requestWidgetUpdate({ widgetName, renderWidget, widgetNotFound })`** — вызывается из кода приложения (например, в `useEffect` при изменении данных). Под капотом: `getWidgetInfo(widgetName)` → для каждого найденного экземпляра вызывается `renderWidget(info)` → `drawWidgetById`. `widgetNotFound` — колбэк для очистки фоновых подписок/таймеров, если ни одного экземпляра виджета на экране нет
3. **`requestWidgetUpdateById({ widgetName, widgetId, renderWidget, widgetNotFound })`** — то же самое, но точечно для одного экземпляра (если уже известен конкретный `widgetId`)
4. Нативный статический метод `RNWidgetJsCommunication.requestWidgetUpdate(...)` — тот же механизм, но вызывается из нативного кода (`BroadcastReceiver`, `AlarmManager`, push-хендлер), когда JS/React-контекст ещё не поднят — он поднимет headless-задачу и передаст `WIDGET_UPDATE`

Таким образом, "инициировать изменение виджета" = либо подождать системный тик, либо самому вызвать `requestWidgetUpdate`/`requestWidgetUpdateById` из любого места приложения (включая фоновые задачи)


## Клики по виджету

Любой примитив принимает `clickAction`/`clickActionData`:

```tsx
<FlexWidget clickAction="OPEN_TASK" clickActionData={{ taskId: '123' }}>
  ...
</FlexWidget>
```

- Кастомный `clickAction` доходит до task handler как `WIDGET_CLICK` с `props.clickAction` и распарсенным (`JSON.parse`) `props.clickActionData`
- Два зарезервированных значения обрабатываются нативно, без похода в JS-обработчик: `OPEN_APP` (просто открывает приложение) и `OPEN_URI` (открывает URL/deeplink из `clickActionData.uri`)
- Работает начиная с Android 7 (ограничение платформы, не библиотеки)


## Виджет как самостоятельная единица vs общий список

Отвечая на прямой вопрос ресёрча: модель — **виджеты самостоятельны, но библиотека не даёт произвольный query-язык** к ним. Аналог "querySelect" — это `getWidgetInfo(widgetName: string): Promise<WidgetInfo[]>` (`src/api/get-widget-info.ts`): возвращает список всех текущих экземпляров данного *провайдера* (`widgetName`) на экране пользователя с их `widgetId`/размерами. Фильтрации по кастомным атрибутам нет — только по имени провайдера, дальше приложение само решает, что с каждым экземпляром делать (обычно — рендерит и пушит одно и то же представление во все, либо конкретное в найденный по `widgetId`)

Практический вывод для Focus Widgets: если у пользователя несколько виджетов с разными фильтрами задач, конфигурация фильтра для конкретного `widgetId` должна храниться в приложении (SQLite, как и запланировано в [`SPECIFICATION.md`](SPECIFICATION.md)) — сама библиотека не знает о "фильтре" виджета, она знает только `widgetId` и то, что ей в `renderWidget` передали


## Конфигурация и превью

- `registerWidgetConfigurationScreen(component)` — регистрирует React Native экран (Android Activity `ACTION_APPWIDGET_CONFIGURE`), который открывается при добавлении виджета с настройками. Обязателен вызов `setResult('ok' | 'cancel')` — `'cancel'` при первом добавлении удаляет виджет
- `WidgetPreview` — компонент для показа превью виджета прямо в UI приложения (экран выбора виджета в Focus Widgets)
- `requestPinWidget({ widgetName })` — программный запрос системного диалога "добавить виджет на экран" (аналог long-press → widgets в лаунчере), возвращает `false`, если платформа/лаунчер не поддерживает


## Ограничения

- Контент рендерится через `RemoteViews`, а там, где `RemoteViews` не хватает выразительности — через промежуточное изображение; полноценного flexbox-движка на устройстве нет
- На части лаунчеров Android передаёт в `widgetInfo.width/height` размер, не совпадающий с фактическим на экране — надёжного способа получить точный размер нет
- `ListWidget`: максимум два на дереве, без вложенности друг в друга
- React-хуки внутри виджет-компонентов не поддерживаются
- `clickAction` работает от Android 7+


## Применение в Focus Widgets

По [`SPECIFICATION.md`](SPECIFICATION.md) обновление данных виджета происходит: при входе в приложение, по тапу на виджет, раз в 30 минут

- Вход в приложение / изменение фильтра → `requestWidgetUpdate` (или `requestWidgetUpdateById`, если известен конкретный виджет), с данными, полученными через [Todoist Sync API](TODOIST_SYNC_API.md) (инкрементально, по <u>syncToken</u>)
- Тап по задаче в виджете → `clickAction` с `taskId`/`widgetId` → в `WIDGET_CLICK` можно либо дёрнуть Sync API и перерисовать сам виджет через `renderWidget`, либо открыть deeplink `todoist://` (см. вывод в [TODOIST_SYNC_API.md](TODOIST_SYNC_API.md#применение-в-focus-widgets))
- Раз в 30 минут → системный `WIDGET_UPDATE` через `updatePeriodMillis`; в обработчике — тот же инкрементальный синк и `renderWidget`
- Конфигурация фильтра для каждого виджета — на стороне приложения (SQLite), привязана к `widgetId`, а не к "имени" виджета, так как один тип виджета может быть добавлен на экран несколько раз с разными фильтрами


## Источники

- [react-native-android-widget — Getting Started](https://saleksovski.github.io/react-native-android-widget/docs)
- [Register widget](https://saleksovski.github.io/react-native-android-widget/docs/tutorial/register-widget)
- [Update Widget](https://saleksovski.github.io/react-native-android-widget/docs/update-widget)
- [Handling Clicks](https://saleksovski.github.io/react-native-android-widget/docs/handling-clicks)
- [Public API](https://saleksovski.github.io/react-native-android-widget/docs/public-api)
- [Limitations](https://saleksovski.github.io/react-native-android-widget/docs/limitations)
- [requestWidgetUpdate](https://saleksovski.github.io/react-native-android-widget/docs/api/request-widget-update)
- [sAleksovski/react-native-android-widget (GitHub)](https://github.com/sAleksovski/react-native-android-widget)
- Исходный код пакета `0.22.1` через unpkg: `src/api/register-widget-task-handler.tsx`, `src/api/request-widget-update.tsx`, `src/api/request-widget-update-by-id.tsx`, `src/api/get-widget-info.ts`, `src/api/build-widget-tree.ts`, `src/api/types.ts`, `src/api/request-pin-widget.ts`, `src/api/register-widget-configuration-screen.tsx`, `src/widgets/ListWidget.tsx`, `src/AndroidWidget.ts`, `src/NativeAndroidWidget.ts`
