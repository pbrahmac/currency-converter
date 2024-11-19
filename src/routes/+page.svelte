<script>
  import Converter from "$lib/components/converter/Converter.svelte";
</script>

<svelte:head>
  <title>Currency Converter - Quid</title>
</svelte:head>

<div class="p-4 mt-20 flex flex-col items-center text-foreground/90">
  <div class="w-full max-w-screen-md py-4 flex flex-col items-center space-y-8">
    <h1 class="font-medium text-xl">Your minimal currency converter.</h1>
    <Converter />
  </div>
</div>
