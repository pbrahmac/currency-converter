<script>
  import { Button } from "$lib/components/ui/button/index";
  import CircleHelp from "lucide-svelte/icons/circle-help";
  import BankNote from "lucide-svelte/icons/banknote";
</script>

<nav class="border-b-2 h-20 flex justify-center items-center w-screen">
  <div class="flex items-center w-full max-w-screen-md justify-between px-4">
    <div class="flex items-center space-x-2">
      <BankNote class="size-7" />
      <span class="font-medium text-xl">Quid</span>
    </div>
    <ul class="flex space-x-2">
      <Button variant="ghost" class="size-12">
        <CircleHelp class="size-6" />
      </Button>
    </ul>
  </div>
</nav>

<svelte:head>
  <title>Quid - Currency Converter</title>
</svelte:head>

<div class="p-4 flex flex-col items-center">
  <h1>Welcome to SvelteKit</h1>
  <p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
  </p>
</div>
