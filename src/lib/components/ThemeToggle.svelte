<script>
  import { buttonVariants } from "$lib/components/ui/button/index";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
  import { cn } from "$lib/utils";
  import Moon from "lucide-svelte/icons/moon-star";
  import Sun from "lucide-svelte/icons/sun";
  import { resetMode, setMode } from "mode-watcher";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class={cn(buttonVariants({ variant: "outline" }), "w-fit")}
  >
    <div class="flex items-center">
      <Sun
        class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="pl-2">Change theme</span>
    </div>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item
    >
    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
