# drop-reactivity-transform 

a tool that helps you drop reactivity transform from your code base in seconds.

# Why
Reactivity Transform was an experimental feature and has now been deprecated. It will be removed from Vue core in 3.4. If you don't want to use it anymore, this tool will help you convert your code and drop it away

## Install
```bash
npm i -g drop-reactivity-transform
```
## Usages
```bash
dropReactivityTransform src
```
**The first parameter is the folder name**

If you use https://github.com/antfu/unplugin-auto-import, and don't want to import these api's from vue, you can use the second parameter `--nonInjectImport` 
```bash
dropReactivityTransform src --nonInjectImport
```

## How?
Converts ReactivityTransform API to reactivity API
- $ref -> ref
- $computed -> computed
- $shallowRef -> shallowRef
- $customRef -> customRef
- $toRef -> toRef

The [reactivity-transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform ) module has actually done the code to convert the above apis to the reactivity API internally. This tool takes that code and modifies it. 

## Example
```ts
<script setup lang="ts">
  let count = $ref<number>(0)
  console.log(count)
</script>
```
will be transformed to :
```ts
<script setup lang="ts">
  import { ref } from 'vue'

  let count = ref<number>(0)
  console.log(count.value)
</script>
```

## with `--nonInjectImport`
```ts
<script setup lang="ts">
  let count = $ref<number>(0)
  console.log(count)
</script>
```
will be transformed to :
```ts
<script setup lang="ts">
  let count = ref<number>(0)
  console.log(count.value)
</script>
```

