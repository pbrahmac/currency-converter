<script>
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button/index";
  import { cn } from "$lib/utils";
  import CircleHelp from "lucide-svelte/icons/circle-help";
  import AnimatedHandCoins from "./AnimatedHandCoins.svelte";

  let isAboutPage = $derived($page.url.pathname === "/about");
</script>

<nav
  class="fixed left-0 top-0 z-50 flex h-20 w-screen items-center drop-shadow justify-center border-b-2 bg-background pt-safe"
>
  <div class="flex items-center w-full max-w-screen-md justify-between px-4">
    <a href="/" class="flex items-center space-x-2">
      <AnimatedHandCoins classes="size-7" />
      <span class="font-semibold text-lg">Quid</span>
    </a>
    <ul class="flex space-x-2">
      <Button
        class={cn("size-12", isAboutPage && "bg-secondary")}
        href={isAboutPage ? "/" : "/about"}
        variant="ghost"
      >
        <CircleHelp class="size-6" />
      </Button>
    </ul>
  </div>
</nav>

<style>
  nav {
    view-transition-name: navbar;
  }
</style>
