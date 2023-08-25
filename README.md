# drop-reactivity-transform 

`drop-reactivity-transform` is a powerful tool that enables you to quickly remove reactivity transform from your code base. It automatically scans all the `.vue`, `.ts`, and `.js` files in your target folder, transforms the code, and replaces the original code as needed - all in a matter of seconds.

![screenshot](screenshot.png)

## Installation
```bash
npm i -g drop-reactivity-transform
```
## Usage

To utilize drop-reactivity-transform, simply specify the target directory name as the first parameter. If no directory name is provided, the tool will default to using the current working directory. Here is an example:
```bash
dropReactivityTransform [target directory name]

# transform files in the src directory
dropReactivityTransform src

# transform files in the working directory
dropReactivityTransform . 

```
If you use [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) and don't want to import these APIs from Vue, you can use the `--nonInjectImport` flag as a second parameter. Here's an example:
```bash
dropReactivityTransform src --nonInjectImport
```
> Please note that the `--nonInjectImport` option only works for `.vue` files. For both `.ts` and `.js` files, the tool will always inject the import regardless of whether this option is specified or not.

# Why use this tool?
Reactivity Transform was an experimental feature and has now been deprecated. It will be removed from Vue core in version 3.4. see [[⚠️ Dropped] Reactivity Transform
](https://github.com/vuejs/rfcs/discussions/369). If you don't want to use it anymore, this tool will help you convert your code and remove it.


# How it works?
The `drop-reactivity-transform` tool converts the following reactivity transform APIs to reactivity APIs:
- `$ref` -> `ref`
- `$computed` -> `computed`
- `$shallowRef` -> `shallowRef`
- `$customRef` -> `customRef`
- `$toRef` -> `toRef`

The [reactivity-transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) module has already implemented the code to internally convert the above APIs to the reactivity API. This tool leverages that code and makes necessary modifications to it.

# Examples of transformation
Here's some examples of the transformation:

### Before
```vue
<script setup lang="ts">
  let count = $ref<number>(0)
  console.log(count)
</script>
```
### After
```vue
<script setup lang="ts">
  import { ref } from 'vue'

  let count = ref<number>(0)
  console.log(count.value)
</script>
```

Here's an example of using the `--nonInjectImport` flag:
### Before
```vue
<script setup lang="ts">
  let count = $ref<number>(0)
  console.log(count)
</script>
```
### After
```vue
<script setup lang="ts">
  let count = ref<number>(0)
  console.log(count.value)
</script>
```

Object destructure
### Before
```ts
const { client } = $(useMasto())
```
### After
```ts
const __$temp_1 = (useMasto()),
  client = toRef(__$temp_1, 'client');
```
> Please note that for this usage scenario, you will need to format the code and manually modify the variable name `_$temp_` yourself

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=edison1105/drop-reactivity-transform&type=Date)](https://star-history.com/#edison1105/drop-reactivity-transform&Date)
