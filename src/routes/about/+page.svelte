<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index";
  import { buttonVariants } from "$lib/components/ui/button/index";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { cn } from "$lib/utils";
  import GitHubLogo from "lucide-svelte/icons/github";
  import LinkedInLogo from "lucide-svelte/icons/linkedin";
</script>

<svelte:head>
  <title>About - Quid</title>
</svelte:head>

<div class="p-4 mt-20 flex flex-col items-center text-foreground/90">
  <div class="w-full max-w-screen-md p-4 flex flex-col space-y-8">
    <div class="flex flex-col">
      <h1 class="font-semibold tracking-wide text-xl mb-4">Settings</h1>
      <h3 class="font-medium">Theme Preference</h3>
      <p class="text-muted-foreground text-sm mb-3">
        Switch between light and dark mode, or follow the system preference.
      </p>
      <ThemeToggle />
    </div>
    <Separator />
    <div class="flex flex-col space-y-4">
      <h1 class="font-semibold tracking-wide text-xl">About Quid</h1>
      <p class="font-light">
        Inspired by <a
          class="underline underline-offset-1"
          href="https://www.yenny.app/">Yenny</a
        >, I wanted to make a currency converter app that could convert between
        any two currencies, even when offline.
      </p>
      <p class="font-light">
        Improving upon Yenny's functionality by opening up the ability to
        convert between any two currencies, rather than just between Yen and
        another currency, will help me during my upcoming trip to Thailand and
        Vietnam, during which I'll be dealing with multiple curriences and a
        spotty Internet connection!
      </p>
      <p class="font-light">
        This is also my first project using Svelte 5 and my way of trying to
        learn the basics of the new reactivity system.
      </p>
    </div>
    <div class="flex flex-wrap gap-y-4 items-center justify-between">
      <div class="flex space-x-2">
        <Avatar.Root class="size-14 border border-foreground">
          <Avatar.Image
            src="https://github.com/pbrahmac.png"
            alt="@_parjanya"
          />
          <Avatar.Fallback>PB</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex flex-col justify-center">
          <p>Parjanya Brahmachari</p>
          <p class="text-sm text-muted-foreground font-light">@_parjanya</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <a
          href="https://github.com/pbrahmac"
          class={cn(buttonVariants({ variant: "outline" }), "size-12")}
          ><GitHubLogo /></a
        >
        <a
          href="https://www.linkedin.com/in/parjanya-b"
          class={cn(buttonVariants({ variant: "outline" }), "size-12")}
          ><LinkedInLogo /></a
        >
      </div>
    </div>
  </div>
</div>
