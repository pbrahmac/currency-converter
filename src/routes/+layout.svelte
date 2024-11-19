<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import Navbar from "$lib/components/Navbar.svelte";
  import { ModeWatcher, mode } from "mode-watcher";
  import "../app.css";

  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <meta name="theme-color" content={$mode === "dark" ? "#0a0a0a" : "#ffffff"} />
</svelte:head>

<ModeWatcher />
<Navbar />
{@render children()}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  :root::view-transition-old(root) {
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
  }

  :root::view-transition-new(root) {
    animation: 150ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in;
  }
</style>
